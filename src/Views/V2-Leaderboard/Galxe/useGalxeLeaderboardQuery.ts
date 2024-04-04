import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { add } from '@Utils/NumString/stringArithmatics';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useWeekOfTournament } from '../Hooks/useWeekOfTournament';
import { getTokenXleaderboardQueryFields } from '../Hooks/useWeeklyLeaderboardQuery';
import { useWeekOffset } from '../Hooks/useWeekoffset';
import { blacklist } from '../blacklist.json';
import { ILeague } from '../interfaces';
import { weeklyTournamentConfig } from './config';
export interface IWinrate extends ILeague {
  winrate: string;
  tradesWon: string;
}
interface ILeaderboardQuery {
  userStats: ILeague[];
  loserStats: ILeague[];
  // winrate: IWinrate[];
  // winnerWinrate: IWinrate[];
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
    (timestamp - 6 * 86400 - 16 * 3600) / (86400 * 7)
  );
  return dayTimestamp;
}

export const useGalxeLeaderboardQuery = () => {
  const { address: account } = useUserAccount();
  const { offset } = useWeekOffset();
  const { activeChain } = useActiveChain();
  const graphUrl = `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-mainnet/version/v2.7.1-galex-leaderboards/api`;
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
    `galxe-leaderboard-arbi-offset-${offset}-account-${account}-weekly-chainId-${activeChain.id}`,
    {
      fetcher: async () => {
        const timestamp = getWeekId(Number(week - Number(offset ?? week)));
        console.log('timestamp', week, timestamp);
        const rewardQueryId = `${timestamp}total`;
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

  const loserUserRank = useMemo(() => {
    if (!data || !data.loserStats || !account) return '-';
    const rank = data.loserStats.findIndex(
      (data) => data.user.toLowerCase() == account.toLowerCase()
    );
    if (rank === -1) return '-';
    else return (rank + 1).toString();
  }, [data?.loserStats, account]);

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
    // winnerWinrateUserRank,
    // loserWinrateUserRank,
  };
};
