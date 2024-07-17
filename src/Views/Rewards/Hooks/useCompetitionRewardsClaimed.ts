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
                competitionRewards(
                  where:{
                    user:"${address}",
                    reward_id_not_in:[
                      "7106022596879106890609359566186964616091349227475309561108206296319268041693"
                      "109219560453902611034722453117112569382286050359351338846602761787810835593901",
                      "100564573772961964144670900170771439966120133774128125317086397789480365887310"
                  ]
                  }) {
                    amount
                    reward_id
                }
            }
            `;
      try {
        const { data, status } = await axios.post('http://localhot:42069/', {
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
    refreshInterval: 1000,
  });
};
