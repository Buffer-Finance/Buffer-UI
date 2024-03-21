import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';

export const useCompetitionRewardsClaimed = () => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const config = getConfig(activeChain.id);
  return useSWR<
    {
      amount: string;
      reward_id: string;
    }[]
  >(`user-competition-rewards-claimed-${activeChain.id}-${address}`, {
    fetcher: async () => {
      const query = `{
                competitionRewards(where:{user:"${address}"}) {
                    amount
                    reward_id
                }
            }
            `;
      try {
        const { data, status } = await axios.post(config.graph.REWARDS, {
          query,
        });

        if (status !== 200) {
          throw new Error('Failed to fetch season total data');
        }
        return data?.data?.competitionRewards;
      } catch (e) {
        console.log(e);
      }
    },
    refreshInterval: 1000 * 60 * 5,
  });
};
