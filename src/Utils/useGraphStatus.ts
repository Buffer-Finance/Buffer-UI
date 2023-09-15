import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';

const useGraphStatus = () => {
  const { activeChain } = useActiveChain();
  console.log('activeChain', activeChain);
  const graphUrlMain = getConfig(activeChain.id).graph.MAIN;
  const { data } = useSWR('graph-status', {
    fetcher: async () => {
      // const liteQuery = axios.post(graphUrlLite, {
      //   query: `{
      //       _meta {
      //           hasIndexingErrors
      //           }
      //   }`,
      // });
      const mainQuery = axios.post(graphUrlMain, {
        query: `{
            _meta {
                hasIndexingErrors
            }            
        }`,
      });
      const response = await Promise.all([
        // liteQuery,
        mainQuery,
      ]);
      const isError = response.reduce((acc, r) => {
        return acc || r.data?.errors ? true : false;
      }, false);
      return { error: isError };
    },
    refreshInterval: 5000,
  });
  return data;
};

export { useGraphStatus };
/*
true 
true 

true



*/
