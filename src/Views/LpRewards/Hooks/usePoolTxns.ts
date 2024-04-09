import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { poolTxn, poolsType, transactionTabType } from '../types';

export const usePoolTxns = (
  activeChain: Chain,
  activePool: poolsType,
  activeTab: transactionTabType
) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;
  const { address } = useUserAccount();

  return useSWR<poolTxn[]>(`${activeChain}-${activePool}-${activeTab}-txns`, {
    fetcher: async () => {
      if (activeTab === 'my' && address === undefined) return [];
      const poolName = activePool === 'aBLP' ? 'ARB' : 'USDC';
      const userAddressQuery =
        activeTab === 'my' ? `,userAddress: "${address}"` : '';
      const query = `{
                blpTxns(
                    first: 10000
                    orderBy: timestamp
                    orderDirection: desc
                    where: {poolName: "${poolName}"  ${userAddressQuery}}
                  ) {
                    userAddress
                    timestamp
                    amount
                    lockPeriod
                    type
                    blpRate
                    unitsMinted
                    txnHash
                    poolName
                  }
            }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          return data.data.blpTxns;
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
