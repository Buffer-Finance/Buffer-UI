import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import axios from 'axios';
import useSWR from 'swr';

export const useWeeklyParticipentsData = (weekId: number, totalPnl: string) => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);

  return useSWR<{
    weeklyLeaderboards: {
      userAddress: string;
    }[];
    samePnl: {
      userAddress: string;
    }[];
  }>(`weekly-participents-${weekId}-${activeChain.id}`, {
    fetcher: async () => {
      if (weekId > getWeekId(0)) {
        return undefined;
      }
      const query = `{
                samePnl:  weeklyLeaderboards(
                    orderBy: totalPnl
                    orderDirection: desc
                    where: {totalPnl: "${totalPnl}", weekId: "${weekId}"}
                  ) {
                    userAddress
                  }
                
                  weeklyLeaderboards(
                    orderBy: totalPnl
                    orderDirection: desc
                    where: {totalPnl_lt: "${totalPnl}", weekId: "${weekId}"}
                  ) {
                    userAddress
                  }
                }`;
      try {
        const { data, status } = await axios.post(config.graph.LEADERBOARD, {
          query,
        });

        if (status !== 200) {
          throw new Error('Failed to fetch season total data');
        }
        return data?.data;
      } catch (e) {
        console.log(e);
      }
    },
    refreshInterval: 1000 * 60 * 5,
  });
};
