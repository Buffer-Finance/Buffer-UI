import { useActiveChain } from '@Hooks/useActiveChain';
import { aboveBelowBaseUrl } from '@Views/ABTradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';

export const useSettlementFee = () => {
  const { activeChain } = useActiveChain();
  const { data: products } = useProductName();
  console.log(`products: `, products);

  return useSWR<
    {
      [marketId: string]: { sf_above: number; sf_below: number };
    } & { Base: number }
  >([activeChain?.id, 'above-below-settlement-fee'], {
    fetcher: async () => {
      if (!activeChain || !products) return null;
      const response = await axios.get(aboveBelowBaseUrl + `settlement_fee/`, {
        params: {
          environment: activeChain?.id,
          product_id: products['AB'].product_id,
        },
      });
      if (response?.data) {
        return response.data['sfs'];
      }
      return null;
    },
    refreshInterval: 1000,
  });
};
