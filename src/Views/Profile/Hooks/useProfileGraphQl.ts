import { useUserAccount } from '@Hooks/useUserAccount';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import { baseGraphqlUrl } from 'config';
import { useMemo } from 'react';
import useSWR from 'swr';

interface ProfileGraphQlResponse {
  userOptionDatas: {
    payout: string | null;
    totalFee: string;
  }[];
  activeData: {
    totalFee: string;
  }[];
}

export interface ItradingMetricsData {
  totalTrades: number;
  net_pnl: string;
  openInterest: string;
  totalPayout: string;
  tradeWon: number;
  volume: string;
}

export const useProfileGraphQl = () => {
  const { address: account } = useUserAccount();
  const { data } = useSWR(`profile-query-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(baseGraphqlUrl, {
        query: `{ 
            userOptionDatas(  
              first: 1000 
              where: {user: "${account}", state_not: 1}) {
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

      console.log(response, 'response');
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
        if (currentValue.payout) {
          newData.totalPayout = add(
            accumulator.totalPayout,
            currentValue.payout
          );
          newData.tradeWon += 1;
          newData.net_pnl = add(
            accumulator.net_pnl,
            subtract(currentValue.payout, currentValue.totalFee)
          );
        } else {
          newData.net_pnl = add(
            accumulator.net_pnl,
            subtract('0', currentValue.totalFee)
          );
        }
        newData.volume = add(accumulator.volume, currentValue.totalFee);
        return newData;
      },
      { totalPayout: '0', tradeWon: 0, volume: '0', net_pnl: '0' }
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
