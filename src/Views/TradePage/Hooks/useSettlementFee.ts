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

export const useSettlementFee = () => {
  const account = useAccount();
  const { activeChain } = useActiveChain();
  const { data } = useSWR<SettlementFee, SettlementFee>(
    [account, 'settlementFee'],
    {
      fetcher: async (account: string, key: string) => {
        const response = await axios.get(
          baseUrl + 'settlement_fee/?environment=421613&asset_pair=ETHUSD'
        );
        console.log(`response: `, response);
        if (response?.data?.USDC) {
          return response.data.USDC.BTCUSD;
        }
        return null;
      },
      refreshInterval: 1000000,
    }
  );
  return data || null;
};
