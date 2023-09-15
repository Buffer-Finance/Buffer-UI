import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';

interface SettlementFee {
  settlement_fee: number;
  settlement_fee_sign_expiration: number;
  settlement_fee_signature: string;
}
export interface IBaseSettlementFees {
  [key: string]: SettlementFee;
}

export const useSettlementFee = () => {
  const { activeChain } = useActiveChain();
  return useSWR<IBaseSettlementFees>([activeChain, 'settlementFee'], {
    fetcher: async () => {
      if (!activeChain) return null;
      const response = await axios.get(
        baseUrl + `settlement_fee/?environment=${activeChain.id}`
      );
      if (response?.data) {
        return response.data;
      }
      return null;
    },
    refreshInterval: 5000,
  });
  // return data || null;
};
