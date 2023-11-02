import { activeChainAtom } from '@Views/NoLoss-V3/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';

const useGraphStatus = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const { data } = useSWR('graph-status', {
    fetcher: async () => {
      if (!activeChain) return undefined;
      const graphUrlMain = getConfig(activeChain?.id).graph.MAIN;
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
