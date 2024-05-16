import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { poolStats, poolsType } from '../types';

export const useCurrentPoolStats = (
  activeChain: Chain,
  activePool: poolsType
) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;

  return useSWR<poolStats>(`${activeChain}-${activePool}-blp-current-stats`, {
    fetcher: async () => {
      const poolName = activePool === 'uBLP' ? 'USDC' : 'ARB';
      const query = `{
                poolStats(where: {id: "current${poolName}"}) {
                   profit
                   loss
                   timestamp
                }
            }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          return data.data.poolStats[0];
        } else {
          throw new Error('Failed to fetch pool stats');
        }
      } catch (e) {
        console.error(e, 'poolStats');
      }
    },
    refreshInterval: 5000,
  });
};
