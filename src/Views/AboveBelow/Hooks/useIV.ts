import { useActiveChain } from '@Hooks/useActiveChain';
import { aboveBelowBaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';

export const useIV = () => {
  const { activeChain } = useActiveChain();
  return useSWR<{ [tv_id: string]: number }>(
    [activeChain?.id, 'above-below-iv'],
    {
      fetcher: async () => {
        if (!activeChain) return null;
        const response = await axios.get(aboveBelowBaseUrl + `iv/`);
        if (response?.data) {
          return response.data;
        }
        return null;
      },
      refreshInterval: 2500,
    }
  );
};
