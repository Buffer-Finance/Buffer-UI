import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import { leaguesConfig } from '@Views/V2-Leaderboard/Leagues/config';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import axios from 'axios';
import useSWR from 'swr';
import { leagueType } from '../../Leagues/atom';

const queryFields = 'totalTrades';

export interface IbarDataResponse {
  weeklyLeaderboards: ILeague[];
  reward: { settlementFee: string; totalFee: string }[];
}

export const useBarData = ({
  league,
  activeChainId,
  offset,
  week,
  config,
}: {
  league: leagueType;
  offset: string | null;
  activeChainId: number;
  week: number;
  config: leaguesConfig;
}) => {
  return useSWR<IbarDataResponse>(
    `${league}-leaderboard-arbi-offset-${offset}-weekly-chainId-${activeChainId}}`,
    {
      fetcher: async () => {
        const timestamp = getWeekId(Number(week - Number(offset ?? week)));
        const leaderboardQuery = `
              weeklyLeaderboards(
                orderBy: netPnL
                orderDirection: desc
                first: 10000
                where: {timestamp: "${timestamp}"}
              ) {
                ${queryFields}
              }
              reward:weeklyRevenueAndFees(where: {id: "${timestamp}USDC"}) {
                settlementFee
                totalFee
              }
            `;

        const query = `{${leaderboardQuery}}`;
        const response = await axios.post(
          'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/version/v2.9.1-ud-ab-nfts-leagues-stats-defillama-merge/api',
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
