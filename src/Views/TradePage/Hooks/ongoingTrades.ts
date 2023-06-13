import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
enum TradeState {
  Queued = 'QUEUED',
}
export interface OngoingTradeSchema {
  id: number;
  signature_timestamp: number;
  queued_timestamp: number;
  queue_id: number;
  strike: number;
  period: number;
  target_contract: string;
  user_partial_signature: string;
  user_full_signature: string;
  user_address: string;
  trade_size: number;
  allow_partial_fill: boolean;
  referral_code: string;
  trader_nft_id: number;
  slippage: number;
  settlement_fee: number;
  settlement_fee_sign_expiration: number;
  settlement_fee_signature: string;
  expiration_time: null | number;
  is_above: boolean;
  state: TradeState;
  option_id: null | number;
  is_limit_order: boolean;
  limit_order_expiration: 0 | number;
  environment: '421613' | '42161';
}

const useOngoingTrades = () => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { data: oneCTWallet } = useSigner({ chainId: activeChain.id });
  const { address } = useAccount();
  console.log(`oneCTWallet: `, oneCTWallet);
  const { data, error } = useSWR([oneCTWallet], {
    fetcher: async (oneCTWallet) => {
      const signature =
        '0xcfd630d3128b6528e5c69e03ac16fac4d211a1ad662bc39d78587420b61f84ae3660dcbf909cf51d31fece68fdbc6c37501ad82206e969e2a16ccb6a94e8f3901b';
      const res = await axios.get(`${baseUrl}trades/`, {
        params: {
          user_signature: signature,
          user_address: address,
          environment: activeChain.id,
        },
      });
      console.log(`ongoingres: `, res);
      return res?.data as OngoingTradeSchema[];
    },
    refreshInterval: 1000,
  });
  return data;
};

export { useOngoingTrades };

// https://oracle.buffer-finance-api.link/instant-trading/trades/?user_signature=0xd36525f738aa4784b21ca77b1aeff5b21a3e18fbd6576d3b2647709a3bc1192f62e0d95c6f5d352d0ebc1b73e621b1f957274a8db4401a8219b61a425dfbc7641b&user_address=0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D&environment=421613
// https://oracle.buffer-finance-api.link/instant-trading/trades/?user_signature=0xcfd630d3128b6528e5c69e03ac16fac4d211a1ad662bc39d78587420b61f84ae3660dcbf909cf51d31fece68fdbc6c37501ad82206e969e2a16ccb6a94e8f3901b&user_address=0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D&environment=421613
