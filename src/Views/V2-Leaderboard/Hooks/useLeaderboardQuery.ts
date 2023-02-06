import axios from 'axios';
import { baseGraphqlUrl } from 'config';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { updateLeaderboardTotalPageAtom } from '../atom';
import { ROWINAPAGE } from '../Incentivised';
import { ILeague } from '../interfaces';
import { useDayOffset } from '../Components/ContestFilterDD';

interface ILeaderboardQuery {
  userStats: ILeague[];
  totalData: {
    totalTrades: number;
    volume: string;
  }[];
  totalPaginationData: { user: string }[];
  userData: ILeague;
}
export function getDayId(offset: number): number {
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * 86400;
  }
  let dayTimestamp = Math.floor((timestamp - 16 * 3600) / 86400);
  return dayTimestamp;
}

export const useLeaderboardQuery = (pageNumber: number, skip: number) => {
  const setTablePages = useSetAtom(updateLeaderboardTotalPageAtom);
  const { address: account } = useUserAccount();
  const { offset } = useDayOffset();
  const timestamp = getDayId(Number(offset));

  const { data } = useSWR<ILeaderboardQuery>(
    `leaderboard-arbi-skip-${skip}-offset-${offset}-account-${account}`,
    {
      fetcher: async () => {
        const leaderboardQuery = `
          userStats: leaderboards(
            orderBy: netPnL
            orderDirection: desc
            first: ${pageNumber}
            skip: ${skip}
            where: {timestamp: "${timestamp}", totalTrades_gte: 5}
          ) {
            user
            totalTrades
            netPnL
            volume
          }
          totalData: leaderboards(
            orderBy: netPnL
            orderDirection: desc
            where: {timestamp: "${timestamp}"}
          ) {
            totalTrades
            volume
          }
          totalPaginationData: leaderboards(
            orderBy: netPnL
            orderDirection: desc
            where: {timestamp: "${timestamp}", totalTrades_gte: 5}
          ) {
            user
          }
        `;
        const userQuery = account
          ? `userData: leaderboards(
          where: {user: "${account}", timestamp: "${timestamp}"}
        ) {
          totalTrades
          netPnL
          volume
          user
        }`
          : '';

        const query = `{${leaderboardQuery}${userQuery}}`;
        const response = await axios.post(baseGraphqlUrl, {
          query,
        });

        return response.data?.data as {};
      },
      refreshInterval: 300,
    }
  );

  const { data: userAboveMe } = useSWR<ILeaderboardQuery>(
    `leaderboard-${data?.userData?.[0]?.netPnL}-${account}`,
    {
      fetcher: async () => {
        const netPnL = data?.userData?.[0]?.netPnL;
        const query = `{
          usersAboveMe: leaderboards(
            orderBy: netPnL
            orderDirection: desc
            where: {timestamp: ${timestamp}, totalTrades_gte: 5, netPnL_gt: ${netPnL}}
            ) {
              user
            }
          }`;
        const response = await axios.post(baseGraphqlUrl, {
          query,
        });

        return response.data?.data as {};
      },
      refreshInterval: 300,
    }
  );

  useEffect(() => {
    //sets total number of pages in arbiturm testnet page
    if (data?.totalPaginationData.length > 0) {
      setTablePages({
        arbitrum: Math.ceil(data.totalPaginationData.length / ROWINAPAGE),
      });
    }
  }, [data?.totalPaginationData]);

  const totalTournamentData = useMemo(() => {
    if (!data?.totalPaginationData || !data.totalData) return null;
    let allTradesCount = 0;
    let totalFee = '0'; //totalFee is the Volume, variable already used everywhere so not changing it.
    let totalUsers = data?.totalData.length;
    let totalRows = data.totalPaginationData.length;
    for (let singleUserTrades of data?.totalData) {
      allTradesCount += singleUserTrades.totalTrades;
      totalFee = add(totalFee, singleUserTrades.volume);
    }
    return { allTradesCount, totalFee, totalRows, totalUsers };
  }, [data?.totalPaginationData, data?.totalData, account]);

  return { data, totalTournamentData };
};

/*
allTradesCount:
  accumulator.allTradesCount + currentvalue.totalTrades,
totalFee: add(accumulator.totalFee, currentvalue.volume),
userRank,
totalRows: accumulator.totalRows + 1,


*/
