import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useActiveChain } from './useActiveChain';
import { useEffect, useRef } from 'react';
import { useToast } from '@Contexts/Toast';
import axios from 'axios';
const duration = 20_000;
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
      console.log(
        `FetchLatestWinsQuery.data.data.userOptionDatas: `,
        FetchLatestWinsQuery.data.data.userOptionDatas.length
      );
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
    console.log(`winner: `, winner);
    if (winner) {
      // toastify({
      //   type: 'success',
      //   msg: toastCount.current == 0 ? 'First toast' : 'Rest toast',
      // });

      toastCount.current++;
    }
  };
  useEffect(() => {
    if (activeChain.id) {
      const config = getConfig(42161);

      intervalRef.current = setInterval(() => {
        // postWinner(config);
        // const dymmmy = {
        //   isAbove: false,
        //   user_address: '0x0e8d670d40f8784c7ebb1f1a67902a6086f5f87c',
        //   duration: 60,
        //   strike: '3105.62',
        //   winAmount: 89.955284,
        //   payout: '189.91',
        //   roi: 90,
        //   asset: 'ETH-USD',
        //   pooltoken: 'USDC',
        //   expirationTime: 1713218570,
        // };
        // let content = <div className="bg-red w-full h-full">helo</div>;
        // toastify({
        //   type: 'recent-win',
        //   msg: content,
        //   data: dymmmy,
        // });
      }, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeChain]);

  return null;
};

export { useRecentWinners };
