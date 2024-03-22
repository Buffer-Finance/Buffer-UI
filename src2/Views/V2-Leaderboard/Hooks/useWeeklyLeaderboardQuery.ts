import axios from 'axios';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { ILeague } from '../interfaces';
import { useWeekOffset } from './useWeekoffset';
import { useWeekOfTournament } from './useWeekOfTournament';
import { useActiveChain } from '@Hooks/useActiveChain';
import { weeklyTournamentConfig } from '../Weekly/config';
import { blacklist } from '../blacklist.json';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { getConfig } from '@Views/TradePage/utils/getConfig';
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
  userData: ILeague[];
  reward: { settlementFee: string; totalFee: string }[];
}

export function getWeekId(offset: number): number {
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * (86400 * 7);
  }
  let dayTimestamp = Math.floor(
    (timestamp - 4 * 86400 - 16 * 3600) / (86400 * 7)
  );
  return dayTimestamp;
}

export function getTokenXleaderboardQueryFields(token: string) {
  const fields = ['NetPnL', 'TotalTrades', 'TradesWon', 'Volume', 'WinRate'];
  return fields.map((field) => token + field).join(' ');
}

export const useWeeklyLeaderboardQuery = () => {
  const { address: account } = useUserAccount();
  const { offset } = useWeekOffset();
  const { activeChain } = useActiveChain();
  const graphUrl = getConfig(activeChain.id).graph.MAIN;
  const configValue = weeklyTournamentConfig[activeChain.id];
  const { week } = useWeekOfTournament({
    startTimestamp: configValue.startTimestamp,
  });

  const poolNames = usePoolNames();
  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );
  const queryFields = useMemo(() => {
    if (tokens.length > 1)
      return tokens
        .map((poolName) =>
          getTokenXleaderboardQueryFields(poolName.toLowerCase())
        )
        .join(' ');
    else return '';
  }, [tokens]);

  const { data } = useSWR<ILeaderboardQuery>(
    `leaderboard-arbi-offset-${offset}-account-${account}-weekly-chainId-${activeChain.id}`,
    {
      fetcher: async () => {
        const timestamp = getWeekId(Number(week - Number(offset ?? week)));
        const rewardQueryId = (
          [arbitrum.id, arbitrumGoerli.id] as number[]
        ).includes(activeChain.id)
          ? `${timestamp}USDC`
          : timestamp;
        const leaderboardQuery = `
          userStats: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: desc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${
          configValue.minTradesToQualifyPNL
        }, user_not_in: [${blacklist.map((address) => `"${address}"`)}]}
          ) {
            user
            totalTrades
            netPnL
            volume
            ${queryFields}
          }

          loserStats: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: asc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${
          configValue.minTradesToQualifyPNL
        }, user_not_in: [${blacklist.map((address) => `"${address}"`)}]}
          ) {
            user
            totalTrades
            netPnL
            volume
            ${queryFields}
          }

          winnerWinrate: weeklyLeaderboards(
            orderBy: winRate
            orderDirection: desc
            first: 100
            where: {timestamp: "${timestamp}", totalTrades_gte: ${
          configValue.minTradesToQualifyWinrate
        }, volume_gte: ${
          configValue.minVolumeToQualifyWinrate
        }, user_not_in: [${blacklist.map((address) => `"${address}"`)}]}
          ) {
            user
            totalTrades
            netPnL
            volume
            winRate
            tradesWon
            ${queryFields}
          }

          totalData: weeklyLeaderboards(
            orderBy: netPnL
            orderDirection: desc
            first: 10000
            where: {timestamp: "${timestamp}"}
          ) {
            totalTrades
            volume
          }

          reward:weeklyRevenueAndFees(where: {id: "${rewardQueryId}"}) {
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
          ${queryFields}
        }`
          : '';

        const query = `{${leaderboardQuery}${userQuery}}`;
        const response = await axios.post(graphUrl, {
          query,
        });

        return response.data?.data as ILeaderboardQuery;
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
            where: {timestamp: "${timestamp}", totalTrades_gte: ${winrateMinimumTrades}, user_not_in: [${blacklist.map(
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
