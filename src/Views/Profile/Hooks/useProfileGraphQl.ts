import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';

interface ProfileGraphQlResponse {
  userOptionDatas: {
    optionContract: {
      address: string;
      asset: string;
      token: string;
    };
    payout: string | null;
    totalFee: string;
  }[];
  activeData: {
    optionContract: {
      address: string;
      token: string;
    };
    totalFee: string;
  }[];
}

type metricsData = {
  tradesPerAsset: { [key: string]: number };
  totalPayouts: { [key: string]: string };
  tradeWon: 0;
  volume: { [key: string]: string };
  net_pnl: { [key: string]: string };
  openInterest: { [key: string]: string };
};

export type ItradingMetricsData = metricsData & {
  totalTrades: number;
};

export const useProfileGraphQl = () => {
  const { address: account } = useUserAccount();
  const { activeChain } = useActiveChain();
  const graphUrl = getConfig(activeChain.id).graph.MAIN;

  const fetchData = async (account: string | undefined) => {
    if (!account) return null;
    const basicQuery = `
      userOptionDatas(  
        first: 10000 
        where: {user: "${account}", state_not: 1}) {
          optionContract {
            address
            token
            asset
          }
          payout
          totalFee
          expirationTime
        }
      activeData:userOptionDatas(
        first: 10000 
        where: {user: "${account}", state: 1}
      ) {
        optionContract {
          address
          token
        }
        totalFee
      }
    `;

    const query = `{${basicQuery}}`;

    const response = await axios.post(graphUrl, {
      query,
    });

    let responseData = response.data?.data;

    return responseData as ProfileGraphQlResponse;
  };

  const { data } = useSWR(
    `profile-query-account-${account}-lastSavedTimestamp-activeChain-${activeChain}`,
    {
      fetcher: () => fetchData(account),
      refreshInterval: 300,
    }
  );

  const tradingMetricsData: ItradingMetricsData | null = useMemo(() => {
    if (!data || !data.userOptionDatas || !data.activeData) return null;

    const computedData = data.userOptionDatas.reduce(
      (accumulator, currentValue) => {
        let newData = accumulator;

        const assetAddress = currentValue.optionContract.asset;
        const token = currentValue.optionContract.token;
        if (newData.tradesPerAsset[assetAddress] !== undefined) {
          newData.tradesPerAsset[assetAddress] += 1;
        } else {
          newData.tradesPerAsset[assetAddress] = 1;
        }

        if (currentValue.payout) {
          newData.totalPayouts[token] = add(
            accumulator.totalPayouts[token] || '0',
            currentValue.payout
          );

          const netPnl = subtract(currentValue.payout, currentValue.totalFee);
          if (parseFloat(netPnl) > 0) {
            newData.tradeWon += 1;
          }

          newData.net_pnl[token] = add(
            accumulator.net_pnl[token] || '0',
            netPnl
          );
        } else {
          newData.net_pnl[token] = add(
            accumulator.net_pnl[token] || '0',
            subtract('0', currentValue.totalFee)
          );
        }

        newData.volume[token] = add(
          accumulator.volume[token] || '0',
          currentValue.totalFee
        );

        return newData;
      },
      {
        totalPayouts: {},
        tradeWon: 0,
        volume: {},
        net_pnl: {},
        tradesPerAsset: {},
      } as metricsData
    );
    const openInterest = data.activeData.reduce((accumulator, currentValue) => {
      const token = currentValue.optionContract.token;
      return token in accumulator
        ? {
            ...accumulator,
            [token]: add(accumulator[token], currentValue.totalFee),
          }
        : {
            ...accumulator,
            [token]: currentValue.totalFee,
          };
    }, {} as Record<string, string>);

    const totalTrades = data.userOptionDatas.length;

    return {
      ...computedData,
      totalTrades,
      openInterest,
    };
  }, [data?.userOptionDatas, data?.activeData]);
  // console.log(tradingMetricsData, data, 'tradingMetricsData');
  return { tradingMetricsData };
};
