import axios from 'axios';
import { baseGraphqlUrl, isTestnet } from 'config';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { updateLeaderboardTotalPageAtom } from '../atom';
import { ROWINAPAGE } from '../Incentivised';
import { ILeague } from '../interfaces';
import { useWeekOffset } from './useWeekoffset';
import { useWeekOfTournament } from './useWeekOfTournament';

interface ILeaderboardQuery {
  userStats: ILeague[];
  loserStats: ILeague[];
  totalData: {
    totalTrades: number;
    volume: string;
  }[];
  // totalPaginationData: { user: string }[];
  userData: ILeague;
  reward: { settlementFee: string; totalFee: string }[];
}

export function getWeekId(offset: number): number {
  console.log(offset, 'timestamp');
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * (86400 * 7);
  }
  let dayTimestamp = Math.floor((timestamp - 10 * 3600) / (86400 * 7));
  return dayTimestamp;
}

export const useWeeklyLeaderboardQuery = () => {
  const setTablePages = useSetAtom(updateLeaderboardTotalPageAtom);
  const { address: account } = useUserAccount();
  const { offset } = useWeekOffset();
  const { week } = useWeekOfTournament();
  const timestamp = getWeekId(Number(week - Number(offset)));
  console.log(timestamp, 'timestamp');
  const minimumTrades = isTestnet ? 5 : 3;

  const { data } = useSWR<ILeaderboardQuery>(
    `leaderboard-arbi-offset-${offset}-account-${account}`,
    {
      fetcher: async () => {
        const leaderboardQuery = `
          userStats: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: desc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${minimumTrades}}
          ) {
            user
            totalTrades
            netPnL
            volume
          }
          loserStats: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: asc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${minimumTrades}}
          ) {
            user
            totalTrades
            netPnL
            volume
          }
          totalData: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: desc
            first: 1000
            where: {timestamp: "${timestamp}"}
          ) {
            totalTrades
            volume
          }
          reward:weeklyRevenueAndFees(where: {id: "${timestamp}"}) {
            settlementFee
            totalFee
          }
          
        `;
        const userQuery = account
          ? `userData: weeklyLeaderboards(
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

  useEffect(() => {
    //sets total number of pages in arbiturm testnet page
    if (data && data.userStats && data.userStats.length > 0) {
      setTablePages({
        arbitrum: Math.ceil(data.userStats.length / ROWINAPAGE),
      });
    }
  }, [data?.userStats]);

  const totalTournamentData = useMemo(() => {
    if (!data || !data.totalData) return null;
    let allTradesCount = 0;
    let totalFee = '0'; //totalFee is the Volume, variable already used everywhere so not changing it.
    let totalUsers = data?.totalData.length;
    let totalRows = data?.totalData.length;
    for (let singleUserTrades of data?.totalData) {
      allTradesCount += singleUserTrades.totalTrades;
      totalFee = add(totalFee, singleUserTrades.volume);
    }
    return { allTradesCount, totalFee, totalRows, totalUsers };
  }, [data?.totalData, account]);

  return { data, totalTournamentData };
};

/*
allTradesCount:
  accumulator.allTradesCount + currentvalue.totalTrades,
totalFee: add(accumulator.totalFee, currentvalue.volume),
userRank,
totalRows: accumulator.totalRows + 1,


*/

// const { data: userAboveMe } = useSWR<ILeaderboardQuery>(
//   `leaderboard-${data?.userData?.[0]?.netPnL}-${account}`,
//   {
//     fetcher: async () => {
//       const netPnL = data?.userData?.[0]?.netPnL;
//       const query = `{
//         usersAboveMe: leaderboards(
//           orderBy: netPnL
//           orderDirection: desc
//           where: {timestamp: ${timestamp}, totalTrades_gte: ${minimumTrades}, netPnL_gt: ${netPnL}}
//           ) {
//             user
//           }
//         }`;
//       const response = await axios.post(baseGraphqlUrl, {
//         query,
//       });

//       return response.data?.data as {};
//     },
//     refreshInterval: 300,
//   }
// );

//not used query
// totalPaginationData: leaderboards(
//           orderBy: netPnL
//           orderDirection: desc
//           where: {timestamp: "${timestamp}", totalTrades_gte: ${minimumTrades}}
//         ) {
//           user
//         }
