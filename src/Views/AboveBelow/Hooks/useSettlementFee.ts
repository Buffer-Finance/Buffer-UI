import { useActiveChain } from '@Hooks/useActiveChain';
import { aboveBelowBaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';

export const useSettlementFee = () => {
  const { activeChain } = useActiveChain();
  return useSWR<
    {
      [marketId: string]: { sf_above: number; sf_below: number };
    } & { Base: number }
  >([activeChain?.id, 'above-below-settlement-fee'], {
    fetcher: async () => {
      if (!activeChain) return null;
      const response = await axios.get(aboveBelowBaseUrl + `settlement_fee/`);
      if (response?.data) {
        return response.data;
      }
      return null;
    },
    refreshInterval: 1000,
  });
};
