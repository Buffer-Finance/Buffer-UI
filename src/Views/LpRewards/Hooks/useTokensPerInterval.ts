import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'viem';
import { tokensPerInterval } from '../types';

export const useTokensPerInterval = (activeChain: Chain) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;
  return useSWR<tokensPerInterval>(`${activeChain}-tokens-per-interval`, {
    fetcher: async () => {
      const query = `{
        usdcPerInterval:rewardsPerIntervals(
            where: {id: "USDC"}
        ) {
            amount
          }
        lockPerInterval:rewardsPerIntervals(
            where: {id: "lock"}
        ) {
            amount
          }
      }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          return data.data;
        } else {
          throw new Error('Failed to fetch tokens per interval');
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
};
