import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { getLBFRconfig } from '../config';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import { getWeekId } from '@Views/V2-Leaderboard/Hooks/useWeeklyLeaderboardQuery';

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
          totalVolume: lbfrstatsPerUsers(where: {userAddress: "${account}", period: weekly, periodID: "${getWeekId(
          0
        )}"}) {
                volume
                volumeUSDC
                volumeARB
                claimable
                claimed
                currentSlab
              }
              lbfrclaimDataPerUser(id: "${account}"){
                lastClaimedTimestamp
              }
        }`,
      });
      return response.data?.data as {
        totalVolume: {
          volume: string;
          volumeUSDC: string;
          volumeARB: string;
          claimed: string;
          claimable: string;
          currentSlab: string;
        }[];
        lbfrclaimDataPerUser: {
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
        lastClaimedTimestamp: string;
      } | null;
    }
  | undefined;
