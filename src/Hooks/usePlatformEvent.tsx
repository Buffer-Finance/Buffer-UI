import axios from 'axios';
import useSWR from 'swr';
import { useActiveChain } from './useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { refreshInterval } from '@Views/TradePage/config';
const emptyArr = [];
const usePlatformEvent = () => {
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  console.log(`usePlatformEvent-configData: `, configData);

  return useSWR('delow-ab', {
    fetcher: async () => {
      const response = await axios.post(configData.graph.EVENTS, {
        query: `{
            platformEvents(first:10, orderBy:updatedAt, orderDirection:desc) {
              user
              id
              updatedAt
              strike
              optionContract {
                pool  
              }
              amount
              payout
              event
            }
          }`,
      });
      // console.log(`response.data?.data: `, response.data?.data);
      // console.log(`thegraphresponse.data: `, response.data);
      console.log(`usePlatformEvent-response.data: `, response.data);
      return response.data?.data?.platformEvents || emptyArr;
    },
    refreshInterval: 1000,
  });
};

export { usePlatformEvent };
