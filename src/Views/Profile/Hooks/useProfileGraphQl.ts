import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import { useMemo, useState } from 'react';
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
  next1000: {
    optionContract: {
      address: string;
      token: string;

      asset: string;
    };
    payout: string | null;
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
  const { configContracts, activeChain } = useActiveChain();

  const fetchData = async (account: string, lastSavedTimestamp: string) => {
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

    const extraQuery = `
      next1000: userOptionDatas(
        first: 10000
        where: {user: "${account}", state_not: 1, expirationTime_gt: ${lastSavedTimestamp}}
      ) {
        optionContract {
          address
          token
          asset
        }
        payout
        totalFee
        expirationTime
      }
    `;

    const query =
      // lastSavedTimestamp
      // ? `{${basicQuery + extraQuery}}`
      // :
      `{${basicQuery}}`;

    const response = await axios.post(configContracts.graph.MAIN, {
      query,
      // variables: {},
    });

    let responseData = response.data?.data;

    if (
      lastSavedTimestamp === null &&
      responseData.userOptionDatas.length === 1000
    ) {
      const newLastSavedTimestamp =
        responseData.userOptionDatas[999].expirationTime;
      const nextData = await fetchData(account, newLastSavedTimestamp);
      responseData.userOptionDatas = [
        ...responseData.userOptionDatas,
        ...nextData.userOptionDatas,
      ];
      responseData.next1000 = nextData.next1000;
    }

    if (lastSavedTimestamp && responseData.next1000.length === 1000) {
      const newLastSavedTimestamp = responseData.next1000[999].expirationTime;
      const nextData = await fetchData(account, newLastSavedTimestamp);
      responseData.next1000 = [...responseData.next1000, ...nextData.next1000];
    }
    return responseData as ProfileGraphQlResponse;
  };

  const { data } = useSWR(
    `profile-query-account-${account}-lastSavedTimestamp-activeChain-${activeChain}`,
    {
      fetcher: () => fetchData(account, null),
      refreshInterval: 300,
    }
  );

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

    //add next1000 data to the computedData

    if (data.next1000) {
      data.next1000.forEach((element) => {
        const assetAddress = element.optionContract.asset;
        if (computedData.tradesPerAsset[assetAddress] !== undefined) {
          computedData.tradesPerAsset[assetAddress] += 1;
        } else {
          computedData.tradesPerAsset[assetAddress] = 1;
        }
        if (element.payout) {
          if (element.optionContract.token === 'USDC') {
            computedData.USDCtotalPayout = add(
              computedData.USDCtotalPayout,

              element.payout
            );
          } else {
            computedData.ARBtotalPayout = add(
              computedData.ARBtotalPayout,
              element.payout
            );
          }
          computedData.tradeWon += 1;
          if (element.optionContract.token === 'USDC') {
            computedData.USDCnet_pnl = add(
              computedData.USDCnet_pnl,
              subtract(element.payout, element.totalFee)
            );
          } else {
            computedData.ARBnet_pnl = add(
              computedData.ARBnet_pnl,
              subtract(element.payout, element.totalFee)
            );
          }
        } else {
          if (element.optionContract.token === 'USDC') {
            computedData.USDCnet_pnl = add(
              computedData.USDCnet_pnl,
              subtract('0', element.totalFee)
            );
          } else {
            computedData.ARBnet_pnl = add(
              computedData.ARBnet_pnl,
              subtract('0', element.totalFee)
            );
          }
        }
        if (element.optionContract.token === 'USDC') {
          computedData.USDCvolume = add(
            computedData.USDCvolume,
            element.totalFee
          );
        } else {
          computedData.ARBvolume = add(
            computedData.ARBvolume,
            element.totalFee
          );
        }
      });
    }

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

    const totalTrades =
      data.userOptionDatas.length + (data.next1000?.length || 0);

    return {
      ...computedData,
      totalTrades,
      USDCopenInterest,
      ARBopenInterest,
    };
  }, [data?.userOptionDatas, data?.activeData, data?.next1000]);
  // console.log(tradingMetricsData, data, 'tradingMetricsData');
  return { tradingMetricsData };
};
