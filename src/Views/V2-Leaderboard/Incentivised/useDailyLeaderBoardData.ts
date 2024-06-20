import { useUserAccount } from '@Hooks/useUserAccount';
import axios from 'axios';
import useSWR from 'swr';
import { IWeeklyLeague } from '../interfaces';

import { useActiveChain } from '@Hooks/useActiveChain';
import { baseLeaderboardURLString } from '@Views/TradePage/config';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useDayOffset } from '../Hooks/useDayOffset';

export interface ILeaderboardQuery {
  winners: IWeeklyLeague[];
  loosers: IWeeklyLeague[];
  userLeague: string;
  total_count: number;
  stats: {
    participants: number;
    total_trades: string;
    total_volume: string;
  };
  //   userData: IWeeklyLeague[];
}

const fetchFromGraph = async (
  graphUrl: string,
  offset: string | null,
  league: string,
  account: string | undefined
) => {
  const timestamp = getDayId(Number(offset ?? '0'));

  const leaderboardQuery = `
      winners: dailyLeaderboards(
        orderBy: totalPnl
        orderDirection: desc
        first: 30
        where:{dayId:"${timestamp}",league:"${league}",totalPnl_gt:"0"}
      ) {
        dayId
        userAddress
        USDCVolume
        USDCPnl
        USDCTrades
        USDCTradesWon
        ARBVolume
        ARBPnl
        ARBTrades
        ARBTradesWon
        BFRVolume
        BFRPnl
        BFRTrades
        ARBTradesWon
        league
        dayId
        weekId
        totalVolume
        totalPnl
        totalTrades
      }

      loosers: dailyLeaderboards(
        orderBy: totalPnl
        orderDirection: asc
        first: 10
        where:{dayId:"${timestamp}",league:"${league}",totalPnl_lte:"0"}
      ) {
        dayId
        userAddress
        USDCVolume
        USDCPnl
        USDCTrades
        USDCTradesWon
        ARBVolume
        ARBPnl
        ARBTrades
        ARBTradesWon
        BFRVolume
        BFRPnl
        BFRTrades
        ARBTradesWon
        league
        dayId
        weekId
        totalVolume
        totalPnl
        totalTrades
      }

      total_count: dailyLeaderboards(
        first:10000
        where:{dayId:"${timestamp}",league:"${league}"}
      ) {
        dayId
      }
      

      
    `;

  const userQuery = account
    ? `
    userStats: dailyLeaderboards(
      orderBy: totalPnl
      orderDirection: desc
      first: 10000
      where:{dayId:"${timestamp}",league:"${league}"}
    ) {
      dayId
      userAddress
      USDCVolume
      USDCPnl
      USDCTrades
      USDCTradesWon
      ARBVolume
      ARBPnl
      ARBTrades
      ARBTradesWon
      BFRVolume
      BFRPnl
      BFRTrades
      ARBTradesWon
      league
      dayId
      weekId
      totalVolume
      totalPnl
      totalTrades
    }
    `
    : '';

  const query = `{${leaderboardQuery}}`;
  const response = await axios.post(graphUrl, {
    query,
  });

  return response.data?.data as ILeaderboardQuery;
};

export function getDayId(offset: number): number {
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * 86400;
  }
  let dayTimestamp = Math.floor((timestamp - 16 * 3600) / 86400);
  console.log(`dayTimestamp: `, dayTimestamp);
  return dayTimestamp;
}

export const useDailyLeaderboardData = (league: string) => {
  const { address: account } = useUserAccount();
  const { offset } = useDayOffset();
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);

  const { data } = useSWR<ILeaderboardQuery>(
    `leaderboard-arbi-offset-${offset}-account-${account}-daily-chainId-${activeChain.id}-league-${league}`,
    {
      fetcher: async () => {
        try {
          const { data } = await axios.get(
            baseLeaderboardURLString + 'rank/daily_leaderboard',
            {
              params: {
                dayId: getDayId(Number(offset ?? '0')),
                league: league,
              },
            }
          );
          if (data?.data) {
            return data.data as ILeaderboardQuery;
          } else {
            throw new Error('No data');
          }
        } catch (E) {
          return undefined;
        }
      },
      refreshInterval: 60000,
    }
  );

  return { data };
};
