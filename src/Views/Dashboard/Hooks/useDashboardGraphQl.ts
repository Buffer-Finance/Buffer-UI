import axios from 'axios';
import { baseGraphqlUrl } from 'config';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';

// const prevDayEpoch = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
// console.log(`prevDayEpoch: `, prevDayEpoch);

type IDashboardGraphQl = {
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
  _meta: {
    block: {
      number: number;
    };
  };
};

export const useDashboardGraphQl = () => {
  const { cache } = useSWRConfig();
  const swrKey = 'history-thegraph';
  const { data } = useSWR(swrKey, {
    fetcher: async () => {
      const prevDayEpoch = Math.floor(
        (Date.now() - 24 * 60 * 60 * 1000) / 1000
      );

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
            _meta {
              block {
                number
              }
            }
          }`,
      });
      const lastData: IDashboardGraphQl = cache.get(swrKey);
      const currentData = response.data?.data as IDashboardGraphQl;
      if (currentData === undefined) return lastData;
      else return currentData;
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
    lastBLock: data?._meta.block.number,
    isGqlDataAvailable: data ? true : false,
  };
};
