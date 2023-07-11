import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '@Views/TradePage/config';
import { response } from '@Views/TradePage/type';
import axios from 'axios';
import useSWR from 'swr';

//fetches all markets from graphql
export const useMarketsRequest = () => {
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

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
                  }
                  address
                  poolContract
                  isPaused
                  category
                  asset
                  openInterest
                }
            }`,
    });
    // console.log(`thegraphresponse.data: `, response.data);
    return response.data?.data as response;
  }

  return useSWR<response, Error>('v3AppConfig', {
    fetcher: fetcher,
    refreshInterval: 30000,
  });
};
