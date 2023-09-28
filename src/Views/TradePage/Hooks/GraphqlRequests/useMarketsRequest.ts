import { useActiveChain } from '@Hooks/useActiveChain';
import { response } from '@Views/TradePage/type';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getAddress } from 'viem';

export const useMarketsRequest = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const { data: bothVersionMrkets, error, mutate } = useBothVersionsMarkets();
  return {
    data: {
      optionContracts: bothVersionMrkets?.optionContracts.filter(
        (optionContract) =>
          optionContract.poolContract !== null &&
          getAddress(configData.router) ===
            getAddress(optionContract.routerContract) &&
          optionContract.configContract !== null
      ),
    },
    error,
    mutate,
  };
};

export const useAllV2_5MarketsRequest = () => {
  const { data: bothVersionMrkets, error, mutate } = useBothVersionsMarkets();
  return {
    data: {
      optionContracts: bothVersionMrkets?.optionContracts.filter(
        (optionContract) =>
          optionContract.poolContract !== null &&
          optionContract.configContract !== null
      ),
    },
    error,
    mutate,
  };
};

export const useV2Markets = () => {
  const { data: bothVersionMrkets, error, mutate } = useBothVersionsMarkets();
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  return {
    data: {
      optionContracts: bothVersionMrkets?.optionContracts.filter(
        (optionContract) =>
          optionContract.poolContract === null &&
          configData['v2_router'] &&
          getAddress(configData['v2_router']) ===
            getAddress(optionContract.routerContract)
      ),
    },
    error,
    mutate,
  };
};

//fetches all markets from graphql
export const useBothVersionsMarkets = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);

  async function fetcher(): Promise<response> {
    const response = await axios.post(configData.graph.MAIN, {
      query: `{ 
        optionContracts(first:1000){
                  configContract {
                    address
                    maxFee
                    maxPeriod
                    minFee
                    minPeriod
                    platformFee
                    earlyCloseThreshold
                    isEarlyCloseEnabled
                    marketOIaddress
                    IV
                    poolOIaddress
                    creationWindowAddress
                    IVFactorOTM
                    IVFactorITM
                    SpreadConfig1
                    SpreadConfig2
                    SpreadFactor
                  }
                  routerContract
                  address
                  poolContract
                  isPaused
                  category
                  asset
                  pool
                }
            }`,
    });
    // console.log(`response.data?.data: `, response.data?.data);
    // console.log(`thegraphresponse.data: `, response.data);
    return response.data?.data as response;
  }

  const { data, error, mutate } = useSWR<response, Error>(
    `v3AppConfig-activeChain-${activeChain.id}`,
    {
      fetcher: fetcher,
      refreshInterval: 60000,
    }
  );

  const response = useMemo(() => {
    if (!data) return { data, error, mutate };
    return {
      mutate,
      error,
      data: {
        optionContracts: data.optionContracts.filter((option) => {
          if (option.poolContract === null) return true;
          return (
            configData.poolsInfo[
              getAddress(
                option.poolContract
              ) as keyof typeof configData.poolsInfo
            ] !== undefined
          );
        }),
      },
    };
  }, [data, error]);

  return response;
};
