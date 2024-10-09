import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { blpPrice, poolsType } from '../types';

export const useBlpRate = (activeChain: Chain, activePool: poolsType) => {
  const graphUrl = indexer_url;

  return useSWR<blpPrice>(`${activeChain}-${activePool}-blp-rate`, {
    fetcher: async () => {
      const poolName = activePool === 'uBLP' ? 'USDC' : 'ARB';
      const query = `{
                blpPrices(where: {id: "current${poolName}"},limit:1000) {
                    items{
                      price
                    tokenXamount
                    blpAmount
                    poolName
                    }
                }
            }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          return data.data.blpPrices.items[0];
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
