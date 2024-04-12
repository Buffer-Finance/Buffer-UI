import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { poolTxn, poolsType } from '../types';

export const useLockTxns = (activeChain: Chain, activePool: poolsType) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;

  return useSWR<poolTxn[]>(`${activeChain}-${activePool}-txns`, {
    fetcher: async () => {
      const poolName = activePool === 'aBLP' ? 'ARB' : 'USDC';

      const query = `{
                nftPoolTxns(
                    first: 10000
                    orderBy: timestamp
                    orderDirection: desc
                    where: {poolName: "${poolName}"}
                  ) {
                    userAddress
                    timestamp
                    amount
                    lockPeriod
                    txnHash
                    poolName
                    nftId
                  }
            }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });

        if (status === 200) {
          return data.data.nftPoolTxns;
        } else if (data.data.errors) {
          throw new Error(data.data.errors[0].message);
        } else {
          throw new Error('Failed to fetch pool transactions');
        }
      } catch (e) {
        console.error(e, 'poolTns');
      }
    },
    refreshInterval: 5000,
  });
};
