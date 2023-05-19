import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { getWeekId } from '@Views/V2-Leaderboard/Hooks/useWeeklyLeaderboardQuery';
import { isTestnet } from 'config';
import { useUserAccount } from '@Hooks/useUserAccount';

const LBFRgraphEndpoint = isTestnet
  ? 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/lbfr-arbitrum-testnet/api'
  : 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/lbfr-arbitrum-mainnet/api';
export const getWeekIdFromTimestamp = (timestamp: number) => {
  let dayTimestamp = Math.floor(
    (timestamp - 4 * 86400 - 16 * 3600) / (86400 * 7)
  );
  return dayTimestamp;
};

export const useLBFRGraphql = () => {
  const { address: account } = useUserAccount();
  const currentWeekId = getWeekId(0);
  const lastWeekId = getWeekId(1);

  const { data } = useSWR(`LBFR-graphql-query-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(LBFRgraphEndpoint, {
        query: `{ 
          totalVolume: lbfrstatsPerUsers(where: {userAddress: "${account}", period: weekly, periodID_in: ["${currentWeekId}","${lastWeekId}"]}) {
                volume
                volumeUSDC
                volumeARB
                claimable
                claimed
                currentSlab
                periodID
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
          periodID: string;
        }[];
        lbfrclaimDataPerUser: {
          lastClaimedTimestamp: string;
        } | null;
      };
    },
    refreshInterval: 300,
  });

  // console.log(data, 'data');
  const totalVolume = useMemo(() => {
    if (data?.totalVolume) {
      const { totalVolume } = data;
      const totalVolumeObj = totalVolume.reduce(
        (acc, curr) => {
          acc.volume = add(acc.volume, curr.volume);
          acc.volumeUSDC = add(acc.volumeUSDC, curr.volumeUSDC);
          acc.volumeARB = add(acc.volumeARB, curr.volumeARB);
          acc.claimed = add(acc.claimed, curr.claimed);
          acc.claimable = add(acc.claimable, curr.claimable);
          if (curr.periodID === currentWeekId.toString()) {
            acc.currentSlab = add(acc.currentSlab, curr.currentSlab);
          }
          return acc;
        },
        {
          volume: '0',
          volumeUSDC: '0',
          volumeARB: '0',
          claimed: '0',
          claimable: '0',
          currentSlab: '0',
        }
      );
      return [totalVolumeObj];
    }
    return null;
  }, [data]);

  return { totalVolume, lbfrclaimDataPerUser: data?.lbfrclaimDataPerUser };
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
