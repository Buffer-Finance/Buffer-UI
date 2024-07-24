import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useActiveChain } from './useActiveChain';
import { useContext, useEffect, useRef, useState } from 'react';
import { NotificationContext, useToast } from '@Contexts/Toast';
import axios from 'axios';
import { MonoChromeMapper } from 'src/App';
import {
  NFTImage,
  UpDownChipSmm,
  formatAddress,
} from '@Views/Jackpot/JackPotWInnerCard';
import { CircleAroundPictureSM } from '@Views/Profile/Components/UserDataComponent/UserData';
const duration = 20_000;
import { Link, useLocation } from 'react-router-dom';
import { miscsSettingsAtom } from '@Views/TradePage/atoms';
import { useAtom } from 'jotai';
const notAllowedSubroutes = new Set(['binary']);
// @ts-nocheck
export const view = (a: bigint, denominationDecimal: number, decimals = 6) => {
  if (a == undefined) return 0;
  if (a == null) return 0;
  if (Number.isNaN(denominationDecimal)) return 0;
  const result =
    Number(
      (BigInt(a) * BigInt(10 ** decimals)) / BigInt(10 ** denominationDecimal)
    ) /
    10 ** decimals;
  return parseFloat(result.toFixed(decimals));
};
const poolToken2decimal = {
  USDC: 6,
  'USDC.e': 6,
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
  useEffect(() => {
    console.log(`toastify-c${toastify}`);
  }, [toastify]);
  const [settings] = useAtom(miscsSettingsAtom);
  const location = useLocation();
  const toastCount = useRef<number>(0);
  let intervalRef = useRef<NodeJS.Timer | null>(null);
  const postWinner = async (config) => {
    if (
      activeChain.id &&
      settings.showPlatformWinningsNotification &&
      toastify
    ) {
      const currentTs = Math.round(Date.now() / 1000);
      console.log(`WIN_POST: `, currentTs, toastCount.current);
      const startTs = toastCount.current || 24 * 60 * 60;
      const getUpDownWinner = async () => {
        const topWinnersQuery = `
            userOptionDatas(
              where: {payout_not: null, expirationTime_gt: ${startTs}}
              orderBy: payout_usd
              orderDirection: desc
              limit:10
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
          FetchLatestWinsQuery = await axios.post('MAIN-PONDER', {
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
                winner.optionContract.token0 +
                '-' +
                winner.optionContract.token1,
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
          <Link to={`/binary/${dymmmy?.asset || 'BTC-USD'}`}>
            <div className="p-2 px-[16px] w-full flex justify-around h-full gap-[14px]">
              <div className="flex items-center gap-2">
                <div className="relative w-[72px] h-[72px] sm:w-[38px] sm:h-[38px] sm:-mt-3 scale-75 ">
                  <CircleAroundPicture />
                  <NFTImage
                    address={winner.user_address}
                    className={
                      'absolute z-0 m-2  w-[68px]  h-[68px]   rounded-full left-[50%] top-[50%] -translate-y-[50%]  -translate-x-[50%] sm:w-full sm:h-full'
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 justify-center text-f14">
                  <div className="text-[#C3C2D4] font-[600]  flex">
                    {formatAddress(dymmmy.user_address)} won
                    <div className=" text-green font-bold flex items-center ml-[4px]">
                      {dymmmy.payout}
                      <img
                        src={Icon}
                        className="w-[14px] h-[14px] ml-[3px] rounded-full"
                      />{' '}
                      &nbsp;
                    </div>{' '}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex  items-center gap-1 text-[#C3C2D4] text-f13 font-bold">
                      on {dymmmy.asset}
                      <div className="mt-[3px] ml-[4px]">
                        <UpDownChipSmm isUp={dymmmy.isAbove} isAb={false} />
                      </div>
                    </div>
                    <div className="text-[#C3C2D4] font-[600] text-f13">
                      TRY NOW
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
        toastify({
          type: 'recent-win',
          msg: content,
          timings: 200,
          id: 'recent-win-notif',
        });

        toastCount.current = currentTs;
      }
    }
  };
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // postWinner(config);
    const config = getConfig(activeChain.id);
    const timeout = setTimeout(() => {
      postWinner(config);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [timer]);

  return null;
};

export { useRecentWinners };

const CircleAroundPicture = () => {
  return (
    <svg
      width="45"
      height="45"
      className="sm:w-[45px] sm:h-[45px] h-[77px] w-[77px] "
      viewBox="0 0 77 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.8633 10.458C68.5591 16.0279 73.0396 23.811 74.4936 32.3984"
        stroke="#A3E3FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
      <path
        d="M43.6172 2.36182C47.4748 2.90243 51.2201 4.06068 54.7095 5.79208"
        stroke="#A3E3FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
      <path
        d="M75 38.5C75 45.7175 72.8598 52.7728 68.85 58.774C64.8401 64.7751 59.1408 69.4524 52.4728 72.2144C45.8047 74.9764 38.4673 75.699 31.3885 74.291C24.3098 72.8829 17.8075 69.4074 12.704 64.3039C7.60043 59.2003 4.12489 52.698 2.71683 45.6193C1.30877 38.5405 2.03144 31.2031 4.79344 24.535C7.55545 17.867 12.2327 12.1677 18.2339 8.15785C24.235 4.14804 31.2903 2.00781 38.5078 2.00781"
        stroke="#3772FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
    </svg>
  );
};
