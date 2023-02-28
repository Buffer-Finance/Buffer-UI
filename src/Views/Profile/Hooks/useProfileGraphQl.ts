import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import { baseGraphqlUrl } from 'config';
import { useMemo } from 'react';
import useSWR from 'swr';

interface ProfileGraphQlResponse {
  userOptionDatas: {
    optionContract: {
      address: string;
    };
    payout: string | null;
    totalFee: string;
  }[];
  activeData: {
    totalFee: string;
  }[];
}
type metricsData = {
  tradesPerAsset: { [key: string]: number };
  tradeWon: number;
  volume: string;
  totalPayout: string;
  net_pnl: string;
};
type ItradingMetricsData = metricsData & {
  totalTrades: number;
};

export const useProfileGraphQl = () => {
  const { address: account } = useUserAccount();
  const { configContracts } = useActiveChain();

  const { data } = useSWR(`profile-query-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
            userOptionDatas(  
              first: 1000 
              where: {user: "${account}", state_not: 1}) {
                optionContract {
                  address
                }
                payout
                totalFee
              }
            activeData:userOptionDatas(
              where: {user: "${account}", state: 1}
            ) {
                totalFee
              }
          }`,
      });

      // console.log(response, 'response');
      return response.data?.data as ProfileGraphQlResponse;
    },
    refreshInterval: 300,
  });

  const tradingMetricsData: ItradingMetricsData | null = useMemo(() => {
    if (!data || !data.userOptionDatas || !data.activeData) return null;

    //counts totalPayout,tradesWon, volume
    const computedData = data.userOptionDatas.reduce(
      (accumulator, currentValue) => {
        let newData = accumulator;

        //increase counter for the asset contract address in tradesPerAsset object
        const assetAddress = currentValue.optionContract.address;
        if (newData.tradesPerAsset[assetAddress] !== undefined) {
          newData.tradesPerAsset[assetAddress] += 1;
        } else {
          newData.tradesPerAsset[assetAddress] = 1;
        }

        // increase the number of trades won and totalPayout if payout is not null -->trade won
        if (currentValue.payout) {
          newData.totalPayout = add(
            accumulator.totalPayout,
            currentValue.payout
          );
          newData.tradeWon += 1;

          // net_pnl= payout - fee --> trade won
          newData.net_pnl = add(
            accumulator.net_pnl,
            subtract(currentValue.payout, currentValue.totalFee)
          );
        } else {
          // net_pnl= 0 - fee --> trade lost
          newData.net_pnl = add(
            accumulator.net_pnl,
            subtract('0', currentValue.totalFee)
          );
        }
        newData.volume = add(accumulator.volume, currentValue.totalFee);
        return newData;
      },
      {
        totalPayout: '0',
        tradeWon: 0,
        volume: '0',
        net_pnl: '0',
        tradesPerAsset: {},
      } as metricsData
    );

    //counts openInterest
    const openInterest = data.activeData.reduce(
      (accumulator, currentValue) => add(accumulator, currentValue.totalFee),
      '0'
    );

    return {
      ...computedData,
      totalTrades: data.userOptionDatas.length,
      openInterest,
    };
  }, [data?.userOptionDatas, data?.activeData]);

  return { tradingMetricsData };
};
