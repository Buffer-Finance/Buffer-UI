import axios from 'axios';
import { baseGraphqlUrl, isTestnet } from 'config';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { ILeague } from '../interfaces';
import { useWeekOffset } from './useWeekoffset';
import { useWeekOfTournament } from './useWeekOfTournament';

export interface IWinrate extends ILeague {
  winrate: string;
  tradesWon: string;
}
interface ILeaderboardQuery {
  userStats: ILeague[];
  loserStats: ILeague[];
  winrate: IWinrate[];
  winnerWinrate: IWinrate[];
  // loserWinrate: IWinrate[];
  totalData: {
    totalTrades: number;
    volume: string;
  }[];
  // totalPaginationData: { user: string }[];
  userData: ILeague[];
  reward: { settlementFee: string; totalFee: string }[];
}

export function getWeekId(offset: number): number {
  console.log(offset, 'timestamp');
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * (86400 * 7);
  }
  let dayTimestamp = Math.floor(
    (timestamp - 4 * 86400 - 16 * 3600) / (86400 * 7)
  );
  return dayTimestamp;
}
export const blockedAccounts = [
  '0x361e9013d7e4f2e4a035ba97fdb42cb7d2540259',
  '0x6fae0eed696ec28c81269b99240ee960570666f1',
  '0x0b8750c12fa14decd31eadff7e92cbd64a198094',
  '0x10df9a95010c8b9fbdc8f6191de824df9c99a8d8',
  '0x547a821c692921d82ebd936320dc1a608a6e38c1',
  '0x2a007f31146ff8f939b6ca3ad18c8d2a6e42eb73',
];

const winrateMinimumTrades = 5;
const minimumWinrateVolume = '100000000';

export const useWeeklyLeaderboardQuery = () => {
  const { address: account } = useUserAccount();
  const { offset } = useWeekOffset();
  const { week } = useWeekOfTournament();
  const timestamp = getWeekId(Number(week - Number(offset ?? week)));
  console.log(timestamp, 'timestamp');
  const minimumTrades = isTestnet ? 5 : 3;

  const { data } = useSWR<ILeaderboardQuery>(
    `leaderboard-arbi-offset-${offset}-account-${account}-weekly`,
    {
      fetcher: async () => {
        const leaderboardQuery = `
          userStats: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: desc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${minimumTrades}, user_not_in: [${blockedAccounts.map(
          (address) => `"${address}"`
        )}]}
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
            where: {timestamp: "${timestamp}", totalTrades_gte: ${minimumTrades}, user_not_in: [${blockedAccounts.map(
          (address) => `"${address}"`
        )}]}
          ) {
            user
            totalTrades
            netPnL
            volume
          }

          winnerWinrate: weeklyLeaderboards(
            orderBy: winRate
            orderDirection: desc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${winrateMinimumTrades}, volume_gte: ${minimumWinrateVolume}, user_not_in: [${blockedAccounts.map(
          (address) => `"${address}"`
        )}]}
          ) {
            user
            totalTrades
            netPnL
            volume
            winRate
            tradesWon
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
          winRate
          tradesWon
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

  const winnerUserRank = useMemo(() => {
    if (!data || !data.userStats || !account) return '-';
    const rank = data.userStats.findIndex(
      (data) => data.user.toLowerCase() == account.toLowerCase()
    );

    if (rank === -1) return '-';
    else return (rank + 1).toString();
  }, [data?.userData, account]);

  const winnerWinrateUserRank = useMemo(() => {
    if (!data || !data.winnerWinrate || !account) return '-';
    const rank = data.winnerWinrate.findIndex(
      (data) => data.user.toLowerCase() == account.toLowerCase()
    );

    if (rank === -1) return '-';
    else return (rank + 1).toString();
  }, [data?.winnerWinrate, account]);

  const loserUserRank = useMemo(() => {
    if (!data || !data.loserStats || !account) return '-';
    const rank = data.loserStats.findIndex(
      (data) => data.user.toLowerCase() == account.toLowerCase()
    );
    if (rank === -1) return '-';
    else return (rank + 1).toString();
  }, [data?.loserStats, account]);

  // const loserWinrateUserRank = useMemo(() => {
  //   if (!data || !data.loserWinrate || !account) return '-';
  //   const rank = data.loserWinrate.findIndex(
  //     (data) => data.user.toLowerCase() == account.toLowerCase()
  //   );
  //   if (rank === -1) return '-';
  //   else return (rank + 1).toString();
  // }, [data?.loserWinrate, account]);

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

  return {
    data,
    totalTournamentData,
    loserUserRank,
    winnerUserRank,
    winnerWinrateUserRank,
    // loserWinrateUserRank,
  };
};

/*
**** Looser winrate query ****

 loserWinrate: weeklyLeaderboards(
            orderBy: winRate
            orderDirection: asc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${winrateMinimumTrades}, user_not_in: [${blockedAccounts.map(
          (address) => `"${address}"`
        )}]}
          ) {
            user
            totalTrades
            netPnL
            volume
            winRate
            tradesWon
          }

*/

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
