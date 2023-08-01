import { useActiveChain } from '@Hooks/useActiveChain';
import { response } from '@Views/TradePage/type';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { getAddress } from 'viem';

//fetches all markets from graphql
export const useMarketsRequest = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);

  async function fetcher(): Promise<response> {
    const response = await axios.post(configData.graph.MAIN, {
      query: `{ 
              optionContracts {
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
                  }
                  address
                  poolContract
                  isPaused
                  category
                  asset
                }
            }`,
    });
    // console.log(`thegraphresponse.data: `, response.data);
    return response.data?.data as response;
  }

  const { data, error } = useSWR<response, Error>('v3AppConfig', {
    fetcher: fetcher,
    refreshInterval: 60000,
  });

  const response = useMemo(() => {
    if (!data) return { data, error };
    return {
      error,
      data: {
        optionContracts: data.optionContracts.filter((option) => {
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
