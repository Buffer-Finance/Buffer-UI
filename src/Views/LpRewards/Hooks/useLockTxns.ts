import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { lockTxn, poolsType } from '../types';

export const useLockTxns = (activeChain: Chain, activePool: poolsType) => {
  const graphUrl = getConfig(activeChain.id).graph.LP;
  const { address } = useUserAccount();

  return useSWR<{ nftPoolTxns: lockTxn[]; totalTxns: { totalTxns: string }[] }>(
    `${activeChain}-${activePool}-txns-${address}`,
    {
      fetcher: async () => {
        if (address === undefined) return [];
        const poolName = activePool === 'aBLP' ? 'ARB' : 'USDC';

        const query = `{
                nftPoolTxns(
                    first: 10000
                    orderBy: timestamp
                    orderDirection: desc
                    where: {poolName: "${poolName}",userAddress:"${address}",isWithdrawn:false}
                  ) {
                    userAddress
                    timestamp
                    amount
                    lockPeriod
                    txnHash
                    poolName
                    nftId
                  }
                totalTxns(where:{id:"lock${address.toLowerCase()}"}){
                  totalTxns
                }
            }`;
        try {
          const { data, status } = await axios.post(graphUrl, { query });

          if (status === 200) {
            return data.data;
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
    }
  );
};
