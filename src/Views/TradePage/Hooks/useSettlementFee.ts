import { useAccount } from 'wagmi';
import { baseUrl } from '../config';
import axios from 'axios';
import useSWR from 'swr';

interface SettlementFee {
  settlement_fee: number;
  settlement_fee_sign_expiration: number;
  settlement_fee_signature: string;
}

export const useSettlementFee = () => {
  const account = useAccount();
  return useSWR<
    { [key: string]: SettlementFee },
    { [key: string]: SettlementFee }
  >([account, 'settlementFee'], {
    fetcher: async () => {
      const response = await axios.get(
        baseUrl + 'settlement_fee/?environment=421613'
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
