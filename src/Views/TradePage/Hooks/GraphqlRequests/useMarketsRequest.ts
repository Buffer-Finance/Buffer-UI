import { useActiveChain } from '@Hooks/useActiveChain';
import { response } from '@Views/TradePage/type';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';

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
                    poolOIaddress
                  }
                  address
                  poolContract
                  isPaused
                  category
                  asset
                }
            }`,
    });
    console.log(`response.data?.data: `, response.data?.data);
    // console.log(`thegraphresponse.data: `, response.data);
    return response.data?.data as response;
  }

  return useSWR<response, Error>('v3AppConfig', {
    fetcher: fetcher,
    refreshInterval: 30000,
  });
};
