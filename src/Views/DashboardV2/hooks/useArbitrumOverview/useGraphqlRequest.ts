import { useActiveChain } from '@Hooks/useActiveChain';
import { responseType, totalStats } from '@Views/DashboardV2/types';
import { appConfig } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { usePoolNames } from '../usePoolNames';
import { useMemo } from 'react';
import { getTokenXquery } from './getTokenXquery';
import { getTokenX24hrsquery } from './getTokenX24hrsquery';
import { getLinuxTimestampBefore24Hours } from '@Views/DashboardV2/utils/getLinuxTimestampBefore24Hours';

export const useGraphqlRequest = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const graphqlURL = config.graph.DASHBOARD;
  const poolNames = usePoolNames();
  const prevDayEpoch = getLinuxTimestampBefore24Hours();

  const tokensArray = useMemo(() => {
    const array = [...poolNames];
    array.unshift('total');
    return array;
  }, []);

  const statsQuery = useMemo(() => {
    return getTokenXquery(tokensArray);
  }, []);
  const stats24hrsQuery = useMemo(() => {
    return getTokenX24hrsquery(tokensArray, prevDayEpoch);
  }, [prevDayEpoch]);
  return useSWR('arbitrum-overview', {
    fetcher: async () => {
      const query = `{ 
        ${statsQuery}
        totalTraders:userStats(where: {period: total}) {
          uniqueCountCumulative
        }
       ${stats24hrsQuery}
      }`;
      const response = await axios.post(graphqlURL, {
        query,
      });
      return response.data?.data as responseType & totalStats;
    },
    refreshInterval: 300,
  });
};
