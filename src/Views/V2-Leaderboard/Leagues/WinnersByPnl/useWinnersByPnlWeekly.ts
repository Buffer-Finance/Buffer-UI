import { ILeaderboardQuery } from '@Views/V2-Leaderboard/Incentivised/useDailyLeaderBoardData';
import axios from 'axios';
import useSWR from 'swr';
import { leagueType } from '../atom';
import { getLeaderboardWeekId } from './getWeekId';
import { baseLeaderboardURLString } from '@Views/TradePage/config';

export const useWinnersByPnlWeekly = ({
  league,
  account,
  activeChainId,
  offset,
  week,
  weekId,
}: {
  league: leagueType;
  offset: string | null;
  account: string | undefined;
  activeChainId: number;
  weekId?: number;
  week: number;
}) => {
  return useSWR<ILeaderboardQuery>(
    `${league}-leaderboard-arbi-offset-${offset}-${weekId}-account-${account}-weekly-chainId-${activeChainId}}`,
    {
      fetcher: async () => {
        try {
          const localWeekId = getLeaderboardWeekId(Number(offset ?? '0'));

          const { data } = await axios.get(
            baseLeaderboardURLString + 'rank/weekly_leaderboard',
            {
              params: {
                weekId: weekId ?? localWeekId,
                league: league[0].toUpperCase() + league.slice(1),
              },
            }
          );
          if (data) {
            return data.data as ILeaderboardQuery;
          } else {
            return undefined;
          }
        } catch (e) {
          return undefined;
        }
      },
      refreshInterval: 60000,
    }
  );
};
