import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import axios from 'axios';
import useSWR from 'swr';

export const useSeasonTotalData = (weekId: number) => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  return useSWR<{
    trades: string;
    volume: string;
    fee: string;
    participents: string;
  }>(`season-total-data-${weekId}-${activeChain.id}`, {
    fetcher: async () => {
      if (weekId > getWeekId(0)) {
        return undefined;
      }
      const query = `{
            totalDatas(where: {id: "${weekId}"}) {
                trades
                volume
                fee
                participents
              }
            }
            `;
      try {
        const { data, status } = await axios.post(config.graph.LEADERBOARD, {
          query,
        });

        if (status !== 200) {
          throw new Error('Failed to fetch season total data');
        }
        return data.data.totalDatas[0];
      } catch (e) {
        console.log(e);
      }
    },
    refreshInterval: 1000 * 60 * 5,
  });
};
