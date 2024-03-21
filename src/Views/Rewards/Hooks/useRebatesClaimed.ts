import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';

export const useRebatesClaimed = () => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const config = getConfig(activeChain.id);
  return useSWR<
    {
      amount: string;
      weekId: string;
    }[]
  >(`user-rebates-claimed-${activeChain.id}-${address}`, {
    fetcher: async () => {
      const query = `{
                rebates(where:{user:"${address}"}) {
                    amount
                    weekId
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
        return data?.data?.rebates;
      } catch (e) {
        console.log(e);
      }
    },
    refreshInterval: 1000 * 60 * 5,
  });
};
