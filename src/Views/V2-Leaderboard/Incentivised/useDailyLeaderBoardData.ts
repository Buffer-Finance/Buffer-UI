import { useUserAccount } from '@Hooks/useUserAccount';
import axios from 'axios';
import useSWR from 'swr';
import { IWeeklyLeague } from '../interfaces';

import { useActiveChain } from '@Hooks/useActiveChain';
import { subtract } from '@Utils/NumString/stringArithmatics';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useDayOfTournament } from '../Hooks/useDayOfTournament';
import { useDayOffset } from '../Hooks/useDayOffset';

export interface ILeaderboardQuery {
  winners: IWeeklyLeague[];
  loosers: IWeeklyLeague[];
  total_count: number;
  //   userData: IWeeklyLeague[];
}

const fetchFromGraph = async (
  day: number,
  offset: string | null,
  league: string,
  account: string | undefined,
  graphUrl: string
) => {
  const timestamp = getDayId(Number(day - Number(offset ?? day)));

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
  const response = await axios.post(
    `https://subgraph.satsuma-prod.com/${
      import.meta.env.VITE_SATSUMA_KEY
    }/bufferfinance/arbitrum-mainnet/version/v2.6.9-points-leaderboards/api`,
    {
      query,
    }
  );

  return response.data?.data as ILeaderboardQuery;
};

export function getDayId(offset: number): number {
  let timestamp = new Date().getTime() / 1000;
  if (offset > 0) {
    timestamp = timestamp - offset * 86400;
  }
  let dayTimestamp = Math.floor((timestamp - 16 * 3600) / 86400);
  console.log('dayTimestamp', dayTimestamp, offset);
  return dayTimestamp;
}

export const useDailyLeaderboardData = (league: string) => {
  const { address: account } = useUserAccount();
  const { offset } = useDayOffset();
  const { activeChain } = useActiveChain();
  const graphUrl = getConfig(activeChain.id).graph.MAIN;
  const { day } = useDayOfTournament();

  const { data } = useSWR<ILeaderboardQuery>(
    `leaderboard-arbi-offset-${offset}-account-${account}-daily-chainId-${activeChain.id}-league-${league}`,
    {
      fetcher: async () => {
        console.log(
          offset,
          day,
          subtract(day.toString(), offset || '0'),
          'offset'
        );
        if (
          offset === null ||
          (offset && subtract(day.toString(), offset) === '0')
        ) {
          console.log('graph');
          return fetchFromGraph(day, offset, league, account, graphUrl);
        } else {
          console.log('api');
          try {
            const { data } = await axios.get(
              import.meta.env.VITE_LEADERBOARD_API_HOST +
                'rank/daily_leaderboard',
              {
                params: {
                  dayId: getDayId(Number(day - Number(offset ?? day))),
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
        }
      },
      refreshInterval: 60000,
    }
  );

  return { data };
};
