import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add, divide } from '@Utils/NumString/stringArithmatics';
import { useActiveChain } from '@Hooks/useActiveChain';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { getLinuxTimestampBefore24Hours } from '../utils/getLinuxTimestampBefore24Hours';
import { appConfig } from '@Views/TradePage/config';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';

export const useOtherChainOverview = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const allDecimals = useDecimalsByAsset();
  const usdcDecimals = allDecimals['USDC'];

  const { data } = useSWR('except-arbitrum-overview', {
    fetcher: async () => {
      if (!config) return;
      const prevDayEpoch = getLinuxTimestampBefore24Hours();
      const response = await axios.post(config.graph.MAIN, {
        query: `{ 
            USDCstats:dashboardStat (id : "USDC") {
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
              first: 10000
              where: {depositToken: "USDC", timestamp_gt: ${prevDayEpoch}}
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
        totalTraders: [{ uniqueCountCumulative: number }];
        USDC24stats: {
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

  const overView = useMemo(() => {
    if (!data) return null;
    const isUSDCnull = !data.USDCstats;
    const usdcVolume = isUSDCnull
      ? '0'
      : fromWei(data.USDCstats.totalVolume, usdcDecimals);
    const totalVolume = usdcVolume;
    const totalTrades = isUSDCnull
      ? '0'
      : (data.USDCstats.totalTrades || 0).toString();

    const avgTrade = divide(totalVolume, totalTrades.toString());

    return {
      USDCfees: isUSDCnull
        ? '0'
        : fromWei(data.USDCstats.totalSettlementFees, usdcDecimals),
      USDCvolume: usdcVolume,
      avgTrade: avgTrade,
      totalTraders: data.totalTraders[0]?.uniqueCountCumulative || 0,
      usdc_24_fees: USDC24hrsStats
        ? fromWei(USDC24hrsStats.settlementFee, usdcDecimals)
        : '0',
      usdc_24_volume: USDC24hrsStats
        ? fromWei(USDC24hrsStats.amount, usdcDecimals)
        : '0',
      trades: totalTrades,
    };
  }, [data]);

  return {
    overView,
  };
};
