import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add, divide } from '@Utils/NumString/stringArithmatics';
import {
  getLinuxTimestampBefore24Hours,
  useDashboardTableData,
} from './useDashboardTableData';
import { useActiveChain } from '@Hooks/useActiveChain';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';

export type tokenX24hrsStats = {
  amount: string;
  settlementFee: string;
};

export type toalTokenXstats = {
  totalSettlementFees: string;
  totalVolume: string;
  totalTrades: number;
};

type responseType = { totalTraders: [{ uniqueCountCumulative: number }] };

type totalStats = { [key: string]: tokenX24hrsStats[] | toalTokenXstats };

export type arbitrumOverview = {
  [key: string]: tokenX24hrsStats | toalTokenXstats;
} & {
  totalTraders: string;
  openInterest: string | null;
};

function getTokenXquery(tokensArray: string[]) {
  return tokensArray
    .map(
      (token) => `${token}stats:dashboardStat (id : "${token}") {
    totalSettlementFees
    totalTrades
    totalVolume
  }`
    )
    .join(' ');
}
function getTokenX24hrsquery(tokensArray: string[], prevDayEpoch: number) {
  return tokensArray
    .map(
      (token) => `${token}24stats:volumePerContracts(
        orderBy: timestamp
        orderDirection: desc
        first: 1000
        where: {depositToken: "${token}", timestamp_gt: ${prevDayEpoch}}
      ) {
          amount
          settlementFee
      }`
    )
    .join(' ');
}

const getTotalStats = (
  data: toalTokenXstats,
  decimals: number
): toalTokenXstats => {
  return {
    totalSettlementFees: divide(data.totalSettlementFees, decimals) as string,
    totalTrades: data.totalTrades,
    totalVolume: divide(data.totalVolume, decimals) as string,
  };
};
const get24hrsStats = (
  data: tokenX24hrsStats[],
  decimals: number
): tokenX24hrsStats => {
  return data.reduce(
    (acc, curr) => {
      return {
        amount: add(acc.amount, divide(curr.amount, decimals) as string),
        settlementFee: add(
          acc.settlementFee,
          divide(curr.settlementFee, decimals) as string
        ),
      };
    },
    { amount: '0', settlementFee: '0' }
  );
};

export const useArbitrumOverview = () => {
  const { configContracts, activeChain } = useActiveChain();
  const { totalData } = useDashboardTableData();
  const prevDayEpoch = getLinuxTimestampBefore24Hours();
  const tokensArray = useMemo(() => {
    const array = Object.keys(configContracts.tokens);
    array.unshift('total');
    return array;
  }, []);

  const statsQuery = useMemo(() => {
    return getTokenXquery(tokensArray);
  }, []);
  const stats24hrsQuery = useMemo(() => {
    return getTokenX24hrsquery(tokensArray, prevDayEpoch);
  }, [prevDayEpoch]);

  const { data } = useSWR('arbitrum-overview', {
    fetcher: async () => {
      if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id)) {
        return null;
      }

      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
            ${statsQuery}
            totalTraders:userStats(where: {period: total}) {
              uniqueCountCumulative
            }
           ${stats24hrsQuery}
          }`,
      });
      return response.data?.data as responseType & totalStats;
    },
    refreshInterval: 300,
  });

  const total24hrsStats = useMemo(() => {
    if (!data) return null;
    const returnObj: Partial<{ [key: string]: tokenX24hrsStats }> = {};
    for (let [key, value] of Object.entries(data)) {
      if (value && key.includes('24')) {
        const decimals =
          configContracts.tokens[key.split('24')[0]]?.decimals ?? 6;
        returnObj[key] = get24hrsStats(value as tokenX24hrsStats[], decimals);
      }
    }
    return returnObj;
  }, [data]);

  const totalStats = useMemo(() => {
    if (!data) return null;
    const returnObj: Partial<{ [key: string]: toalTokenXstats }> = {};
    for (let [key, value] of Object.entries(data)) {
      if (value && !key.includes('24') && key.includes('stats')) {
        const decimals =
          configContracts.tokens[key.split('24')[0]]?.decimals ?? 6;
        returnObj[key] = getTotalStats(value as toalTokenXstats, decimals);
      }
    }
    return returnObj;
  }, [data]);

  const overView = useMemo(() => {
    if (!data) return null;
    return {
      totalTraders: data.totalTraders[0]?.uniqueCountCumulative || 0,
      openInterest: totalData ? totalData.openInterest : null,
      ...total24hrsStats,
      ...totalStats,
    };
  }, [data, totalData]);

  console.log(overView, 'overViewResponse');

  return {
    overView,
  };
};
