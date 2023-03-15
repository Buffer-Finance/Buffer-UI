import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add, divide } from '@Utils/NumString/stringArithmatics';
import {
  getLinuxTimestampBefore24Hours,
  useDashboardTableData,
} from './useDashboardTableData';
// const prevDayEpoch =  Math.floor((Date.now() - 24*60*60*1000) / 1000);
// console.log(`prevDayEpoch: `,prevDayEpoch);
import { useActiveChain } from '@Hooks/useActiveChain';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { usdcDecimals } from '@Views/V2-Leaderboard/Incentivised';
const prevDayEpoch = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
console.log(`prevDayEpoch: `, prevDayEpoch);

export const useDashboardGraphQl = () => {
  const { configContracts } = useActiveChain();
  const { totalData } = useDashboardTableData();

  const { data } = useSWR('history-thegraph', {
    fetcher: async () => {
      const prevDayEpoch = getLinuxTimestampBefore24Hours();

      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
            USDCstats:dashboardStat (id : "USDC") {
              totalSettlementFees
              totalTrades
              totalVolume
            }
            BFRstats:dashboardStat (id : "BFR") {
              totalSettlementFees
              totalTrades
              totalVolume
            }
            totalTraders:userStats(where: {period: total}) {
              uniqueCountCumulative
            }
            USDC24stats:volumePerContracts(
              orderBy: timestamp
              orderDirection: desc
              first: 1000
              where: {depositToken: "USDC", timestamp_gt: ${prevDayEpoch}}
            ) {
                amount
                settlementFee
            }
            BFR24stats:volumePerContracts(
              orderBy: timestamp
              orderDirection: desc
              where: {depositToken: "BFR", timestamp_gt: ${prevDayEpoch}}
            ) {
                amount
                settlementFee
            }
          }`,
      });
      return response.data?.data as {
        USDCstats: {
          totalSettlementFees: string;
          totalVolume: string;
          totalTrades: number;
        };
        BFRstats: {
          totalSettlementFees: string;
          totalVolume: string;
          totalTrades: number;
        };
        totalTraders: [{ uniqueCountCumulative: number }];
        USDC24stats: {
          amount: string;
          settlementFee: string;
        }[];
        BFR24stats: {
          amount: string;
          settlementFee: string;
        }[];
      };
    },
    refreshInterval: 300,
  });

  const USDC24hrsStats = useMemo(() => {
    if (data?.USDC24stats) {
      return {
        ...data.USDC24stats.reduce(
          (acc, curr) => {
            return {
              amount: add(acc.amount, curr.amount),
              settlementFee: add(acc.settlementFee, curr.settlementFee),
            };
          },
          { amount: '0', settlementFee: '0' }
        ),
      };
    }
    return null;
  }, [data?.USDC24stats]);

  const BFR24hrsStats = useMemo(() => {
    if (data?.BFR24stats) {
      return {
        ...data.BFR24stats.reduce(
          (acc, curr) => {
            return {
              amount: add(acc.amount, curr.amount),
              settlementFee: add(acc.settlementFee, curr.settlementFee),
            };
          },
          { amount: '0', settlementFee: '0' }
        ),
      };
    }
    return null;
  }, [data?.BFR24stats]);

  const overView = useMemo(() => {
    if (!data) return null;
    const isUSDCnull = !data.USDCstats;
    const isBFRnull = !data.BFRstats;
    const usdcVolume = isUSDCnull
      ? '0'
      : fromWei(data.USDCstats.totalVolume, usdcDecimals);
    const bfrVolume = isBFRnull ? '0' : fromWei(data.BFRstats.totalVolume);
    const totalVolume = add(usdcVolume, bfrVolume);
    const totalTrades = isUSDCnull
      ? '0'
      : (
          (data.USDCstats.totalTrades || 0) + (data.BFRstats?.totalTrades || 0)
        ).toString();

    const avgTrade = divide(totalVolume, totalTrades.toString());

    return {
      USDCfees: isUSDCnull
        ? '0'
        : fromWei(data.USDCstats.totalSettlementFees, usdcDecimals),
      BFRfees: isBFRnull ? '0' : fromWei(data.BFRstats.totalSettlementFees),
      USDCvolume: usdcVolume,
      BFRvolume: bfrVolume,
      avgTrade: avgTrade,
      totalTraders: data.totalTraders[0]?.uniqueCountCumulative || 0,
      usdc_24_fees: USDC24hrsStats
        ? fromWei(USDC24hrsStats.settlementFee, usdcDecimals)
        : '0',
      usdc_24_volume: USDC24hrsStats
        ? fromWei(USDC24hrsStats.amount, usdcDecimals)
        : '0',
      trades: totalData ? totalData.trades : null,
      openInterest: totalData ? totalData.openInterest : null,
    };
  }, [data, totalData]);

  console.log(overView, 'overView');

  return {
    overView,
  };
};
