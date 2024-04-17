import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useActiveChain } from './useActiveChain';
import { useEffect, useRef } from 'react';
import { useToast } from '@Contexts/Toast';
import axios from 'axios';
import { MonoChromeMapper } from 'src/App';
import {
  NFTImage,
  UpDownChipSmm,
  formatAddress,
} from '@Views/Jackpot/JackPotWInnerCard';
import { CircleAroundPictureSM } from '@Views/Profile/Components/UserDataComponent/UserData';
const duration = 20_000;
import { Link } from 'react-router-dom';
const notAllowedSubroutes = new Set(['binary', 'ab']);
// @ts-nocheck
export const view = (a: bigint, denominationDecimal: number, decimals = 6) => {
  if (a == undefined) return 0;
  if (a == null) return 0;
  const result =
    Number(
      (BigInt(a) * BigInt(10 ** decimals)) / BigInt(10 ** denominationDecimal)
    ) /
    10 ** decimals;
  return parseFloat(result.toFixed(decimals));
};
const poolToken2decimal = {
  USDC: 6,
  ARB: 18,
};
export const getPoolToken = (trade: TradeStr) => {
  return poolToken2decimal[trade.poolToken];
};
export const convertToBigint = (trade: TradeStr): Traden => {
  return {
    payout: BigInt(trade.payout),
    expirationTime: BigInt(trade.expirationTime),
    poolToken: trade.poolToken,
    totalFee: BigInt(trade.totalFee),
    user: trade.user,
    payout_usd: BigInt(trade.payout_usd || trade.payout),
    strike: BigInt(trade.strike),
  };
};
const useRecentWinners = () => {
  const { activeChain } = useActiveChain();
  const toastify = useToast();
  const toastCount = useRef<number>(0);
  let intervalRef = useRef<NodeJS.Timer | null>(null);
  const postWinner = async (config) => {
    const getUpDownWinner = async () => {
      const currentTs = Math.round(Date.now() / 1000);
      const startTs =
        currentTs -
        Math.round(
          (!toastCount.current ? 24 * 60 * 60 * 1000 : duration) / 1000
        );
      console.log(`startTs: `, startTs);

      const topWinnersQuery = `
            userOptionDatas(
              where: {payout_not: null, expirationTime_gt: ${startTs}}
              orderBy: payout_usd
              orderDirection: desc
            ) {
              payout
              poolToken
              user
              expirationTime
                closeTime
              totalFee
              strike
                settlementFee
              isAbove
                    creationTime
              payout_usd
                optionContract {
                token0
                token1
                }
            }
            `;
      let FetchLatestWinsQuery = -1;
      try {
        FetchLatestWinsQuery = await axios.post(config.graph.MAIN, {
          query: `{${topWinnersQuery}}`,
        });
      } catch (e) {
        console.log('eee');
      }
      if (FetchLatestWinsQuery == -1) {
        console.log('error fetching data');
        return null;
      }
      const winners = FetchLatestWinsQuery.data.data.userOptionDatas?.map(
        (winner) => {
          const decimals = getPoolToken(winner);
          const firstTrade = convertToBigint(winner);
          // console.log(`firstTrade.payout_usd: `, firstTrade.payout_usd);
          const winAmount = view(
            firstTrade.payout - firstTrade.totalFee,
            decimals
          );
          const profit = firstTrade.payout - firstTrade.totalFee;
          let roi = Number((profit * 100n) / firstTrade.totalFee) / 100;
          roi *= 100;
          // console.log(`firstTrade.totalFee: `, firstTrade.totalFee);
          // console.log(`firstTrade.payout: `, firstTrade.payout);
          // console.log(`roi: `, roi);

          return {
            isAbove: winner.isAbove,
            user_address: firstTrade.user,
            duration: winner.expirationTime - winner.creationTime, // is it ms or seconds?
            strike: view(firstTrade.strike, 8).toFixed(2),
            winAmount,
            payout: view(firstTrade.payout, decimals).toFixed(2),
            roi: roi,
            asset:
              winner.optionContract.token0 + '-' + winner.optionContract.token1,
            pooltoken: winner.poolToken,
            expirationTime: +winner.expirationTime,
          };
        }
      );

      if (winners.length) {
        return winners[0];
      } else {
        return null;
      }
    };
    const winner = await getUpDownWinner();
    const isAllowed = (function () {
      const str = window.location.href;
      const hash = str.split('#')?.[1];
      if (hash) {
        const subroutes = hash.split('/');
        for (let subroute of subroutes) {
          if (notAllowedSubroutes.has(subroute.toLowerCase())) {
            return false;
          }
        }
      }
      return true;
    })();
    console.log(`useRecentWinners-isAllowed: `, isAllowed, winner);
    if (winner && isAllowed) {
      const dymmmy = winner;
      const Icon = MonoChromeMapper[dymmmy.pooltoken];
      let content = (
        <Link to={'/binary/BTC-USD'}>
          <div className="p-2 px-[16px] w-full flex justify-around h-full gap-[14px]">
            <div className="flex flex-col gap-2 justify-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <CircleAroundPictureSM />

                  <NFTImage address={dymmmy.user_address} className="m-1 " />
                </div>
                <div className="text-[#C3C2D4] font-[600] text-f12">
                  {formatAddress(dymmmy.user_address)}
                </div>
              </div>
              <div className="flex ml-3 items-center gap-1 text-[#C3C2D4] text-f13 font-bold">
                {dymmmy.asset}
                <div className="mt-[3px] ml-[4px]">
                  <UpDownChipSmm isUp={dymmmy.isAbove} isAb={false} />
                </div>
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <img src="/BronzeBg.svg" className="w-[26px] h-[26px]"></img>
              <div className="text-f22 text-green font-bold">
                {dymmmy.payout}
              </div>
              <img src={Icon} className="ml-1 w-[24px] h-[24px]"></img>
            </div>
          </div>
        </Link>
      );
      toastify({
        type: 'recent-win',
        msg: content,
        timings: 200,
      });

      toastCount.current++;
    }
  };
  useEffect(() => {
    if (activeChain.id) {
      const config = getConfig(activeChain.id);
      postWinner(config);
      intervalRef.current = setInterval(() => {
        postWinner(config);
      }, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeChain]);

  return null;
};

export { useRecentWinners };
