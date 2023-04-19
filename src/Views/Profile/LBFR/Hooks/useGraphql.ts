import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { getLBFRconfig } from '../config';
import { add, subtract } from '@Utils/NumString/stringArithmatics';

export const getWeekIdFromTimestamp = (timestamp: number) => {
  let dayTimestamp = Math.floor(
    (timestamp - 4 * 86400 - 16 * 3600) / (86400 * 7)
  );
  return dayTimestamp;
};

export const useLBFRGraphql = () => {
  const { configContracts } = useActiveChain();
  const { address: account } = useAccount();

  const { data } = useSWR(`LBFR-graphql-query-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
          totalVolume: lbfrstatsPerUsers(where: {userAddress: "${account}", period: "total"}) {
                volume
                volumeUSDC
                volumeARB
              }
              lbfrclaimDataPerUser(id: "${account}"){
                claimed
                claimable
                lastClaimedTimestamp
              }
        }`,
      });
      return response.data?.data as {
        totalVolume: {
          volume: string;
          volumeUSDC: string;
          volumeARB: string;
        }[];
        lbfrclaimDataPerUser: {
          claimed: string;
          claimable: string;
          lastClaimedTimestamp: string;
        } | null;
      };
    },
    refreshInterval: 300,
  });

  // console.log(data, 'data');
  return data;
};

export type LBFRGraphqlType =
  | {
      totalVolume: {
        [key: string]: string;
      }[];
      lbfrclaimDataPerUser: {
        claimed: string;
        claimable: string;
        lastClaimedTimestamp: string;
      } | null;
    }
  | undefined;
