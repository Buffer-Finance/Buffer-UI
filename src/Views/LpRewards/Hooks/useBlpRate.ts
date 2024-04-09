import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { blpPrice, poolsType } from '../types';

export const useBlpRate = (activeChain: Chain, activePool: poolsType) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;

  return useSWR<blpPrice>(`${activeChain}-${activePool}-blp-rate`, {
    fetcher: async () => {
      const query = `{
                blpPrices(where: {id: "Current${activePool}"}) {
                    price
                    tokenXamount
                    blpAmount
                    poolName
                }
            }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          return data.data.blpPrices[0];
        } else {
          throw new Error('Failed to fetch pool transactions');
        }
      } catch (e) {
        console.error(e, 'blpPrice');
      }
    },
    refreshInterval: 5000,
  });
};
