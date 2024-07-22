import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { getAddress } from 'viem';

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
      if (!address) {
        return [];
      }
      const query = `{
        competitionRewards(where:{user:"${getAddress(address)}"}){
          items{
            rewardId
            user
            amount
          }
        }
            }
            `;
      try {
        const { data, status } = await axios.post(
          'http://ponder.buffer.finance/',
          {
            query,
          }
        );

        if (status !== 200) {
          throw new Error('Failed to fetch season total data');
        }
        return data?.data?.competitionRewards.items.map((d) => ({
          ...d,
          reward_id: d.rewardId,
        }));
      } catch (e) {
        console.log(e);
      }
    },
    refreshInterval: 1000,
  });
};
