import axios from 'axios';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { add, divide } from '@Utils/NumString/stringArithmatics';
import {
  getLinuxTimestampBefore24Hours,
  useDashboardTableData,
} from './useDashboardTableData';
import { useActiveChain } from '@Hooks/useActiveChain';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { IToken } from '@Views/BinaryOptions';

type tokenX24hrsStats = {
  amount: string;
  settlementFee: string;
}[];

type toalTokenXstats = {
  totalSettlementFees: string;
  totalVolume: string;
  totalTrades: number;
};

type responseType = {
  totalTraders: [{ uniqueCountCumulative: number }];
  USDC24stats: tokenX24hrsStats;
  ARB24stats: tokenX24hrsStats;
};
type totalStats = { [key: string]: toalTokenXstats };

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

export const useArbitrumOverview = () => {
  const { configContracts, activeChain } = useActiveChain();
  const { totalData } = useDashboardTableData();

  const statsQuery = useMemo(() => {
    const tokensArray = Object.keys(configContracts.tokens);
    tokensArray.unshift('total');
    return getTokenXquery(tokensArray);
  }, []);

  const { data } = useSWR('arbitrum-overview', {
    fetcher: async () => {
      if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id)) {
        return null;
      }
      const prevDayEpoch = getLinuxTimestampBefore24Hours();

      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
            ${statsQuery}
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
            ARB24stats:volumePerContracts(
              orderBy: timestamp
              orderDirection: desc
              where: {depositToken: "ARB", timestamp_gt: ${prevDayEpoch}}
            ) {
                amount
                settlementFee
            }
          }`,
      });
      return response.data?.data as responseType & totalStats;
    },
    refreshInterval: 300,
  });

  const get24hrsStats = (data: tokenX24hrsStats, tokenName: string) => {
    return data.reduce(
      (acc, curr) => {
        return {
          amount: add(acc.amount, curr.amount),
          settlementFee: add(acc.settlementFee, curr.settlementFee),
        };
      },
      { amount: '0', settlementFee: '0' }
    );
  };

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

  const ARB24hrsStats = useMemo(() => {
    if (data?.ARB24stats) {
      return {
        ...data.ARB24stats.reduce(
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
  }, [data?.ARB24stats]);

  const overView = useMemo(() => {
    if (!data) return null;
    const isUSDCnull = !data.USDCstats;
    const isARBnull = !data.ARBstats;
    const usdcVolume = isUSDCnull
      ? '0'
      : fromWei(
          data.USDCstats.totalVolume,
          configContracts.tokens['USDC'].decimals
        );
    const arbVolume = isARBnull ? '0' : fromWei(data.ARBstats.totalVolume);
    const totalVolume = add(usdcVolume, arbVolume);
    const totalTrades = isUSDCnull
      ? '0'
      : (
          (data.USDCstats.totalTrades || 0) + (data.ARBstats?.totalTrades || 0)
        ).toString();

    const avgTrade = divide(totalVolume, totalTrades.toString());

    return {
      USDCfees: isUSDCnull
        ? '0'
        : fromWei(
            data.USDCstats.totalSettlementFees,
            configContracts.tokens['USDC'].decimals
          ),
      ARBfees: isARBnull ? '0' : fromWei(data.ARBstats.totalSettlementFees),
      USDCvolume: usdcVolume,
      ARBvolume: arbVolume,
      avgTrade: avgTrade,
      totalTraders: data.totalTraders[0]?.uniqueCountCumulative || 0,
      usdc_24_fees: USDC24hrsStats
        ? fromWei(
            USDC24hrsStats.settlementFee,
            configContracts.tokens['USDC'].decimals
          )
        : '0',
      usdc_24_volume: USDC24hrsStats
        ? fromWei(
            USDC24hrsStats.amount,
            configContracts.tokens['USDC'].decimals
          )
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
