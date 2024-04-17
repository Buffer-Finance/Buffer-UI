import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { poolTxn, poolsType, transactionTabType } from '../types';

export const usePoolTxns = (
  activeChain: Chain,
  activePool: poolsType,
  activeTab: transactionTabType,
  activePage: number
) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;
  const { address } = useUserAccount();

  return useSWR<{ blpTxns: poolTxn[]; totalTxns: { totalTxns: string }[] }>(
    `${activeChain}-${activePool}-${activeTab}-txns-${activePage}`,
    {
      fetcher: async () => {
        if (activeTab === 'my' && address === undefined) return [];
        const poolName = activePool === 'aBLP' ? 'ARB' : 'USDC';
        const userAddressQuery =
          activeTab === 'my' ? `,userAddress: "${address}"` : '';
        const skip = (activePage - 1) * 10;
        const skipQuery = activeTab === 'all' ? `skip: ${skip}` : '';
        const firstQuery = activeTab === 'all' ? 'first: 10' : 'first:10000';
        const query = `{
                blpTxns(
                    ${firstQuery}
                    ${skipQuery}
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
                  totalTxns(where:{id:"pool"}){
                    totalTxns
                  }
            }`;
        try {
          const { data, status } = await axios.post(graphUrl, { query });
          if (status === 200) {
            return data.data;
          } else {
            throw new Error('Failed to fetch pool transactions');
          }
        } catch (e) {
          console.error(e, 'poolTns');
        }
      },
      refreshInterval: 5000,
    }
  );
};
