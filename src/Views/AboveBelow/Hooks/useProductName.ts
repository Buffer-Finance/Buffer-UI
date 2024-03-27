import { useActiveChain } from '@Hooks/useActiveChain';
import { aboveBelowBaseUrl } from '@Views/ABTradePage/config';
import axios from 'axios';
import useSWR from 'swr';

export const useProductName = () => {
  const { activeChain } = useActiveChain();

  return useSWR<{
    [productName: string]: {
      environment: string;
      id: number;
      product_id: string;
    };
  }>([activeChain?.id, 'above-below-product-name'], {
    fetcher: async () => {
      if (!activeChain) return undefined;
      const response = await axios.get(aboveBelowBaseUrl + `products/`, {
        params: { environment: activeChain.id },
      });
      if (response?.data) {
        return response.data;
      }
      return null;
    },
    refreshInterval: 1000,
  });
};
