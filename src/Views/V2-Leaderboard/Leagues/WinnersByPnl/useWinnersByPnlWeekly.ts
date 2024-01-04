import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { blacklist } from '../../blacklist.json';
import { leagueType, leagueUsersAtom } from '../atom';
import { leaguesConfig } from '../config';
import { getWeekId } from './getWeekId';

const queryFields =
  'user totalTrades netPnL volume winRate tradesWon usdcNetPnL usdcTotalTrades usdcTradesWon usdcVolume usdcWinRate arbNetPnL arbTotalTrades arbTradesWon arbVolume arbWinRate bfrNetPnL bfrTotalTrades bfrTradesWon bfrVolume bfrWinRate';

export interface IleaderboardQueryResponse {
  weeklyLeaderboards: ILeague[];
  userData: ILeague[];
}

function getUsersNotInThisLeague(
  leagueUsers: Record<leagueType, string[]>,
  league: leagueType
) {
  switch (league) {
    case 'silver':
      return leagueUsers.gold.concat(
        leagueUsers.platinum,
        leagueUsers.diamond,
        blacklist
      );
    case 'gold':
      return leagueUsers.silver.concat(
        leagueUsers.platinum,
        leagueUsers.diamond,
        blacklist
      );
    case 'platinum':
      return leagueUsers.silver.concat(
        leagueUsers.gold,
        leagueUsers.diamond,
        blacklist
      );
    case 'diamond':
      return leagueUsers.silver.concat(
        leagueUsers.gold,
        leagueUsers.platinum,
        blacklist
      );
    case 'bronze':
      return leagueUsers.silver.concat(
        leagueUsers.gold,
        leagueUsers.platinum,
        leagueUsers.diamond,
        blacklist
      );
  }
}

export const useWinnersByPnlWeekly = ({
  league,
  account,
  activeChainId,
  offset,
  week,
  config,
}: {
  league: leagueType;
  offset: string | null;
  account: string | undefined;
  activeChainId: number;
  week: number;
  config: leaguesConfig;
}) => {
  const leagueUsers = useAtomValue(leagueUsersAtom);
  return useSWR<IleaderboardQueryResponse>(
    `${league}-leaderboard-arbi-offset-${offset}-account-${account}-weekly-chainId-${activeChainId}-leagueUsers-${leagueUsers[league].length}`,
    {
      fetcher: async () => {
        if (league !== 'bronze' && leagueUsers[league].length === 0) {
          return;
        }
        const usersNotInThisLeague = getUsersNotInThisLeague(
          leagueUsers,
          league
        );
        const timestamp = getWeekId(Number(week - Number(offset ?? week)));
        const leaderboardQuery = `
              weeklyLeaderboards(
                orderBy: netPnL
                orderDirection: desc
                first: 100
                where: {or:[{timestamp: "${timestamp}",volume_gte: ${
          config.minVolumeToqualifyPNL
        } ,volume_lte: ${config.maxVolumeToqualifyPNL} ,totalTrades_lte: ${
          config.maxTradesToqualifyPNL
        }, totalTrades_gte: ${
          config.minTradesToQualifyPNL
        }, user_not_in: [${usersNotInThisLeague.map(
          (address) => `"${address}"`
        )}]},{
          timestamp: "${timestamp}"
          user_in: [${leagueUsers[league].map((address) => `"${address}"`)}]
        }]}
              ) {
                ${queryFields}
              }
            `;

        const userQuery = account
          ? `userData: weeklyLeaderboards(
            where: {user: "${account}", timestamp: "${timestamp}"}
          ) {
              ${queryFields}
            }`
          : '';
        const query = `{${leaderboardQuery}${userQuery}}`;
        const response = await axios.post(
          'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/version/v2.7.5-merge-5/api',
          {
            query,
          }
        );

        return response.data?.data;
      },
      refreshInterval: 60000,
    }
  );
};
