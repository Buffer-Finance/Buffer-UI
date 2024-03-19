import { baseLeaderboardURLString } from '@Views/TradePage/config';
import { ILeaderboardQuery } from '@Views/V2-Leaderboard/Incentivised/useDailyLeaderBoardData';
import axios from 'axios';
import useSWR from 'swr';
import { leagueType } from '../atom';
import { getWeekId } from './getWeekId';

export const useWinnersByPnlWeekly = ({
  league,
  account,
  activeChainId,
  offset,
  week,
}: {
  league: leagueType;
  offset: string | null;
  account: string | undefined;
  activeChainId: number;
  week: number;
}) => {
  return useSWR<ILeaderboardQuery>(
    `${league}-leaderboard-arbi-offset-${offset}-account-${account}-weekly-chainId-${activeChainId}}`,
    {
      fetcher: async () => {
        try {
          const weekId = getWeekId(Number(week - Number(offset ?? week)));

          const { data } = await axios.get(
            baseLeaderboardURLString + 'rank/weekly_leaderboard',
            {
              params: {
                weekId: weekId,
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
