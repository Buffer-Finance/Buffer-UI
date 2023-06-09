import { useAccount } from 'wagmi';
import { baseUrl } from '../config';
import axios from 'axios';
import useSWR from 'swr';
import { useActiveChain } from '@Hooks/useActiveChain';

export const useSettlementFee = () => {
  const account = useAccount();
  const { activeChain } = useActiveChain();
  const res = useSWR([account, 'settlementFee'], {
    fetcher: async (account: string, key: string) => {
      const response = await axios.get(
        baseUrl +
          'instant-trading/settlement_fee?environment=421613&asset_pair=ETHUSD'
      );
      console.log(`response: `, response);
      return { hello: 'world' };
    },
    refreshInterval: 1000000,
  });
  return res;
};
