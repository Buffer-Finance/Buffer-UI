import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';

interface ProfileGraphQlResponse {
  userOptionDatas: {
    optionContract: {
      address: string;
      token: string;
      asset: string;
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
  tradeWon: number;
  USDCvolume: string;
  USDCtotalPayout: string;
  USDCnet_pnl: string;
  openInterest: string;
  ARBvolume: string;
  ARBtotalPayout: string;
  ARBnet_pnl: string;
  ARBopenInterest: string;
};
export type ItradingMetricsData = metricsData & {
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
                  token
                  asset
                }
                payout
                totalFee
              }
            activeData:userOptionDatas(
              where: {user: "${account}", state: 1}
            ) {
              optionContract {
                address
                token
              }
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
        const assetAddress = currentValue.optionContract.asset;
        const token = currentValue.optionContract.token;
        if (newData.tradesPerAsset[assetAddress] !== undefined) {
          newData.tradesPerAsset[assetAddress] += 1;
        } else {
          newData.tradesPerAsset[assetAddress] = 1;
        }

        // increase the number of trades won and totalPayout if payout is not null -->trade won
        if (currentValue.payout) {
          if (token === 'USDC') {
            newData.USDCtotalPayout = add(
              accumulator.USDCtotalPayout,
              currentValue.payout
            );
          } else {
            newData.ARBtotalPayout = add(
              accumulator.ARBtotalPayout,
              currentValue.payout
            );
          }
          newData.tradeWon += 1;

          // net_pnl= payout - fee --> trade won
          if (token === 'USDC') {
            newData.USDCnet_pnl = add(
              accumulator.USDCnet_pnl,
              subtract(currentValue.payout, currentValue.totalFee)
            );
          } else {
            newData.ARBnet_pnl = add(
              accumulator.ARBnet_pnl,
              subtract(currentValue.payout, currentValue.totalFee)
            );
          }
        } else {
          // net_pnl= 0 - fee --> trade lost
          if (token === 'USDC') {
            newData.USDCnet_pnl = add(
              accumulator.USDCnet_pnl,
              subtract('0', currentValue.totalFee)
            );
          } else {
            newData.ARBnet_pnl = add(
              accumulator.ARBnet_pnl,
              subtract('0', currentValue.totalFee)
            );
          }
        }
        if (token === 'USDC') {
          newData.USDCvolume = add(
            accumulator.USDCvolume,
            currentValue.totalFee
          );
        } else {
          newData.ARBvolume = add(accumulator.ARBvolume, currentValue.totalFee);
        }
        return newData;
      },
      {
        USDCtotalPayout: '0',
        ARBtotalPayout: '0',
        tradeWon: 0,
        USDCvolume: '0',
        ARBvolume: '0',
        USDCnet_pnl: '0',
        ARBnet_pnl: '0',
        tradesPerAsset: {},
      } as metricsData
    );

    //counts openInterest
    const USDCopenInterest = data.activeData.reduce(
      (accumulator, currentValue) => {
        if (currentValue.optionContract.token === 'USDC')
          return add(accumulator, currentValue.totalFee);
        else return accumulator;
      },
      '0'
    );
    const ARBopenInterest = data.activeData.reduce(
      (accumulator, currentValue) => {
        if (currentValue.optionContract.token === 'ARB')
          return add(accumulator, currentValue.totalFee);
        else return accumulator;
      },
      '0'
    );

    return {
      ...computedData,
      totalTrades: data.userOptionDatas.length,
      USDCopenInterest,
      ARBopenInterest,
    };
  }, [data?.userOptionDatas, data?.activeData]);

  return { tradingMetricsData };
};
