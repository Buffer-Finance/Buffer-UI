import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import useSWR from 'swr';

export const usePastTradeQueryByFetch = ({
  account,
  currentTime,
}: {
  account: string;
  currentTime: number;
}) => {
  const { configContracts } = useActiveChain();
  const { data } = useSWR(`history-thegraph-totalPages-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.LITE, {
        query: `{ 
            _meta {
              block {
                number
              }
            }
            historyLength: userOptionDatas(
              orderBy: expirationTime
              orderDirection: desc
              first: 1000
              where: {
                user_: {address: "${account}"},
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime}
              }
            ){ 
                id  
            }
             activeLength: userOptionDatas(
              orderBy: creationTime
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
                state_in: [1],
                expirationTime_gt: ${currentTime}
              }
            ){
                id
            }

             cancelledLength: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
                state_in: [5],
              }
            ){
                id
            }
          }`,
      });
      return response.data?.data;
    },
    refreshInterval: 300,
  });
};
