import { useActiveChain } from '@Hooks/useActiveChain';
import { aboveBelowBaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';

export const useIV = () => {
  const { activeChain } = useActiveChain();
  const { data: products } = useProductName();
  console.log({ products });
  return useSWR<{ [tv_id: string]: number }>(
    [activeChain?.id, 'above-below-iv'],
    {
      fetcher: async () => {
        if (!activeChain || !products) return null;
        const response = await axios.get(aboveBelowBaseUrl + `iv/`, {
          params: {
            environment: activeChain?.id,
            product_id: products['AB'].product_id,
          },
        });
        if (response?.data) {
          return response.data;
        }
        return null;
      },
      refreshInterval: 100,
    }
  );
};
