import { useActiveChain } from '@Hooks/useActiveChain';
import { aboveBelowBaseUrl } from '@Views/ABTradePage/config';
import { appConfig } from '@Views/TradePage/config';
import axios from 'axios';
import { useMemo } from 'react';
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
    refreshInterval: 100000,
  });
};
export const useProducts = () => {
  const { activeChain } = useActiveChain();

  return useMemo(() => {
    if (activeChain.id in appConfig)
      if (appConfig[activeChain.id]?.product_id) {
        return appConfig[activeChain.id].product_id;
      }
    return null;
  }, [activeChain]);
};
