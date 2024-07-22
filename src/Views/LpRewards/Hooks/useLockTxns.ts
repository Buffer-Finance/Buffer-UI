import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'wagmi';
import { lockTxn, poolsType } from '../types';
import { getAddress } from 'viem';

export const useLockTxns = (activeChain: Chain, activePool: poolsType) => {
  const graphUrl = 'http://ponder.buffer.finance/';
  const { address } = useUserAccount();

  return useSWR<{ nftPoolTxns: lockTxn[]; totalTxns: { totalTxns: string }[] }>(
    `${activeChain}-${activePool}-txns-${address}`,
    {
      fetcher: async () => {
        if (address === undefined)
          return {
            nftPoolTxns: [],
            totalTxns: [{ totalTxns: '0' }],
          };
        const poolName = activePool === 'aBLP' ? 'ARB' : 'USDC';

        const query = `{
                nftPoolTxns(
                    limit: 1000,
                    orderBy: "timestamp",
                    orderDirection: "desc",
                    where: {poolName: "${poolName}",userAddress:"${getAddress(
          address
        )}",isWithdrawn:false}
                  ) {
                   items{
                    userAddress
                    timestamp
                    amount
                    lockPeriod
                    txnHash
                    poolName
                    nftId
                   }
                  }
                totalTxns(where:{id:"lock${address.toLowerCase()}"}){
                  items{
                    totalTxns
                  }
                }
            }`;
        try {
          const { data, status } = await axios.post(graphUrl, { query });

          if (status === 200) {
            const returnResponse = {
              nftPoolTxns: data.data.nftPoolTxns.items,
              totalTxns: data.data.totalTxns.items,
            };
            return returnResponse;
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
