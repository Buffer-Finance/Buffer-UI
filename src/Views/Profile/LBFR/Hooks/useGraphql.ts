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
  const { configContracts, activeChain } = useActiveChain();
  const { address: account } = useAccount();
  const weekId = useMemo(() => {
    let response = null;
    try {
      const timestamp = getLBFRconfig(activeChain.id).startTimestamp;
      response = getWeekIdFromTimestamp(timestamp);
    } catch (e) {
      console.log(e, 'LBFR graphql error');
    }
    return response;
  }, []);
  const { data } = useSWR(
    `LBFR-graphql-query-account-${account}-weekId-${weekId}`,
    {
      fetcher: async () => {
        const response = await axios.post(configContracts.graph.MAIN, {
          query: `{ 
            lbfrstatsPerUsers(where: {userAddress: "${account}", id_gte: "${weekId}"}, period: "weekly") {
                lBFRAlloted
                volume
                volumeUSDC
                volumeARB
              }
              claimedLBFRPerUsers(where: {userAddress: "${account}"}) {
                lBFRClaimed
                timestamp
              }
        }`,
        });
        return response.data?.data as {
          lbfrstatsPerUsers: {
            lBFRAlloted: string;
            timestamp: string;
            volume: string;
            volumeUSDC: string;
            volumeARB: string;
          }[];
          claimedLBFRPerUsers: {
            lBFRClaimed: string;

            timestamp: string;
          };
        };
      },
      refreshInterval: 300,
    }
  );

  const totalbfrstatsPerUsersData: LBFRgraphtype = useMemo(() => {
    let response = null;
    if (data?.lbfrstatsPerUsers) {
      response = data.lbfrstatsPerUsers.reduce(
        (acc, cur) => {
          acc.lBFRAlloted = add(acc.lBFRAlloted, cur.lBFRAlloted);
          acc.volume = add(acc.volume, cur.volume);
          acc.volumeUSDC = add(acc.volumeUSDC, cur.volumeUSDC);
          acc.volumeARB = add(acc.volumeARB, cur.volumeARB);
          return acc;
        },
        {
          lBFRAlloted: '0',
          volume: '0',
          volumeUSDC: '0',
          volumeARB: '0',
        }
      );
    }
    if (data?.claimedLBFRPerUsers) {
      response;
    }
    return response;
  }, [data]);

  console.log(data, totalbfrstatsPerUsersData, 'data');
  return {
    ...totalbfrstatsPerUsersData,
    lastClaimed: data?.claimedLBFRPerUsers.timestamp,
    claimed: data?.claimedLBFRPerUsers.lBFRClaimed,
  };
};
export type LBFRgraphtype = {
  lBFRAlloted: string;
  volume: string;
  volumeUSDC: string;
  volumeARB: string;
} | null;
export type LBFRclaimType =
  | LBFRgraphtype
  | {
      lastClaimed: string | undefined;
      claimed: string | undefined;
    };
