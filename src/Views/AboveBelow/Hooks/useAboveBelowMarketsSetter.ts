import { useActiveChain } from '@Hooks/useActiveChain';
import { marketsForChart } from '@Views/TradePage/config';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import useSWR from 'swr';
import { getAddress } from 'viem';
import {
  aboveBelowAllMarketsSetterAtom,
  aboveBelowmarketsSetterAtom,
} from '../atoms';
import { marketTypeAB, responseAB } from '../types';

//fetches all markets from graphql
export const useAboveBelowMarketsSetter = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const setMarkets = useSetAtom(aboveBelowmarketsSetterAtom);
  const setAllMarkets = useSetAtom(aboveBelowAllMarketsSetterAtom);

  async function fetcher(): Promise<{
    optionContracts: responseAB[];
    allContracts: responseAB[];
  }> {
    const response = await axios.post(configData.graph.ABOVE_BELOW, {
      query: `{ 
        optionContracts(first:10000,where:{routerContract:"${configData.above_below_router}"}) {
            address
            token1
            token0
            isPaused
            routerContract
            poolContract
            openUp
            openDown
            openInterestUp
            openInterestDown
            config {
              address
              maxSkew
              creationWindowContract
              circuitBreakerContract
              iv
              traderNFTContract
              sf
              sfdContract
              payout
              platformFee
              optionStorageContract
              stepSize
            }
          }
          allContracts:optionContracts(first:10000) {
            address
            token1
            token0
            isPaused
            routerContract
            poolContract
            openUp
            openDown
            openInterestUp
            openInterestDown
            config {
              address
              maxSkew
              creationWindowContract
              circuitBreakerContract
              iv
              traderNFTContract
              sf
              sfdContract
              payout
              platformFee
              optionStorageContract
              stepSize
            }
          }
        }`,
    });

    return response.data?.data as {
      optionContracts: responseAB[];
      allContracts: responseAB[];
    };
  }

  const { data, error, mutate } = useSWR<
    { optionContracts: responseAB[]; allContracts: responseAB[] },
    Error
  >(`above-below-activeChain-${activeChain.id}`, {
    fetcher: fetcher,
    refreshInterval: 60000,
  });
  useEffect(() => {
    if (data?.optionContracts)
      setMarkets(
        data.optionContracts
          .map((option) => {
            const poolInfo =
              configData.poolsInfo[
                getAddress(
                  option.poolContract
                ) as keyof typeof configData.poolsInfo
              ];
            if (!poolInfo) return null;
            const chartData =
              marketsForChart[
                (option.token0 + option.token1) as keyof typeof marketsForChart
              ];
            if (!chartData) return null;
            return {
              ...option,
              poolInfo: poolInfo,
              ...chartData,
            };
          })
          .filter((option) => option !== null) as marketTypeAB[]
      );
    if (data?.allContracts)
      setAllMarkets(
        data.allContracts
          .map((option) => {
            const poolInfo =
              configData.poolsInfo[
                getAddress(
                  option.poolContract
                ) as keyof typeof configData.poolsInfo
              ];
            if (!poolInfo) return null;
            const chartData =
              marketsForChart[
                (option.token0 + option.token1) as keyof typeof marketsForChart
              ];
            if (!chartData) return null;
            return {
              ...option,
              poolInfo: poolInfo,
              ...chartData,
            };
          })
          .filter((option) => option !== null) as marketTypeAB[]
      );
  }, [data, activeChain]);
};
