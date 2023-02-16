import axios from 'axios';
import { baseGraphqlLiteUrl, baseGraphqlUrl } from 'config';
import useSWR from 'swr';

const useGraphStatus = () => {
  const { data } = useSWR('graph-status', {
    fetcher: async () => {
      const liteQuery = axios.post(baseGraphqlLiteUrl.sandbox, {
        query: `{
            _meta {
                hasIndexingErrors
                }            
        }`,
      });
      const mainQuery = axios.post(baseGraphqlUrl, {
        query: `{
            _meta {
                hasIndexingErrors
            }            
        }`,
      });
      const response = await Promise.all([liteQuery, mainQuery]);
      const isError = response.reduce((acc, r) => {
        return (acc || r.data?.errors ? true:false);
      }, false);
      return {error:isError};
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

