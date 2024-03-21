import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import axios from 'axios';
import useSWR from 'swr';

export const useSeasonUserData = (weekId: number) => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const config = getConfig(activeChain.id);
  return useSWR<{
    USDCVolume: string;
    USDCPnl: string;
    USDCFee: string;
    ARBVolume: string;
    ARBPnl: string;
    ARBFee: string;
    BFRVolume: string;
    BFRPnl: string;
    BFRFee: string;
    league: string;
    weekId: number;
    totalVolume: string;
    totalPnl: string;
    totalFee: string;
  }>(`season-user-data-${weekId}-${activeChain.id}-${address}`, {
    fetcher: async () => {
      if (weekId > getWeekId(0)) {
        return undefined;
      }
      const query = `{
                weeklyLeaderboards(
                    where: {weekId: "${weekId}", userAddress: "${address}"}
                ) {
                    USDCVolume
                    USDCPnl
                    USDCFee
                    ARBVolume
                    ARBPnl
                    ARBFee
                    BFRVolume
                    BFRPnl
                    BFRFee
                    league
                    weekId
                    totalVolume
                    totalPnl
                    totalFee
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
        return data?.data?.weeklyLeaderboards[0];
      } catch (e) {
        console.log(e);
      }
    },
    refreshInterval: 1000 * 60 * 5,
  });
};
