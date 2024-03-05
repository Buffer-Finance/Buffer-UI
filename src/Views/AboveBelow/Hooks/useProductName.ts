import { useActiveChain } from '@Hooks/useActiveChain';
import { upDOwnV3BaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';

export const useProductName = () => {
  const { activeChain } = useActiveChain();
  return useSWR<{
    [productName: string]: string;
  }>([activeChain?.id, 'up-down-v3-product-name'], {
    fetcher: async () => {
      if (!activeChain) return undefined;
      const response = await axios.get(upDOwnV3BaseUrl + `products/`, {
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
