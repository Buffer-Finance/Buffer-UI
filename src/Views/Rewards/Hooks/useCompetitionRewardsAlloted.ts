import { useUserAccount } from '@Hooks/useUserAccount';
import { baseLeaderboardURLString } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';

export const useCompetitionRewardsAlloted = () => {
  const { address } = useUserAccount();

  return useSWR<
    {
      id: number;
      weekId: number;
      address: string;
      contract: string;
      token: string;
      amount: string;
      reward_id: string;
      signature: string;
      note: string;
      created_at: string;
      updated_at: string;
      time_threshold: number;
    }[]
  >(`user-competition-rewards-alloted-${address}`, {
    fetcher: async () => {
      if (!address) {
        return [];
      }
      try {
        const { data, status } = await axios.get(
          baseLeaderboardURLString + `rewards/${address}`
        );

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
