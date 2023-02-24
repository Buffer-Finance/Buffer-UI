import axios from 'axios';
import { baseGraphqlUrl } from 'config';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { getLinuxTimestampBefore24Hours } from './useDashboardTableData';
// const prevDayEpoch =  Math.floor((Date.now() - 24*60*60*1000) / 1000);
// console.log(`prevDayEpoch: `,prevDayEpoch);

export const useDashboardGraphQl = () => {
  const { data } = useSWR('history-thegraph', {
    fetcher: async () => {
      const prevDayEpoch = getLinuxTimestampBefore24Hours();

      const response = await axios.post(baseGraphqlUrl, {
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

  return {
    USDCstats: data?.USDCstats,
    BFRstats: data?.BFRstats,
    totalTraders: data?.totalTraders,
    USDC24stats: USDC24hrsStats,
    BFR24stats: BFR24hrsStats,
    isGqlDataAvailable: data ? true : false,
  };
};
