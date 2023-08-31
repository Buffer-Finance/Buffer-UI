import { useAccount } from 'wagmi';
import { baseUrl } from '../config';
import axios from 'axios';
import useSWR from 'swr';
import { useActiveChain } from '@Hooks/useActiveChain';

interface SettlementFee {
  settlement_fee: number;
  settlement_fee_sign_expiration: number;
  settlement_fee_signature: string;
}
export interface IBaseSettlementFees {
  [key: string]: SettlementFee;
}

export const useSettlementFee = () => {
  const account = useAccount();
  const { activeChain } = useActiveChain();
  return useSWR<IBaseSettlementFees>([account, 'settlementFee'], {
    fetcher: async () => {
      const response = await axios.get(
        baseUrl + `settlement_fee/?environment=${activeChain.id}`
      );
      if (response?.data) {
        return response.data;
      }
      return null;
    },
    refreshInterval: 1000000,
  });
  // return data || null;
};
