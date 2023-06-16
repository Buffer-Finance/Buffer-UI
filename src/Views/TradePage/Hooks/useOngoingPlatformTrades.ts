import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer } from 'ethers';
export enum TradeState {
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
  close_time: number;
  user_full_signature: string;
  user_address: string;
  trade_size: number;
  locked_amount: number;
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

export let signatureCache =
  '0x1e8a7e159ab9eb4ac8770db32dce52e26366c52f91bbf224ef1d75d96fc656586058a5899701adda5956002fb1fdf53fda0d1aa981be6a493bc08914508bf2d51c';

const getCachedSignature = async (oneCTWallet: Signer) => {
  if (!signatureCache) {
    signatureCache = await oneCTWallet.signMessage(
      import.meta.env.VITE_SIGN_MESSAGE
    );
  }
  return signatureCache;
};

const usePlatformTrades = () => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { data: oneCTWallet } = useSigner({ chainId: activeChain.id });
  const { address } = useAccount();
  const { data, error } = useSWR<OngoingTradeSchema[][]>('i am platform data', {
    fetcher: async (oneCTWallet) => {
      const signature = await getCachedSignature(oneCTWallet);
      console.log(`ssssignature: `, signature);
      const response = await Promise.all([
        axios.get(`${baseUrl}trades/all_active/`, {
          params: {
            user_signature: signature,
            user_address: address,
            environment: activeChain.id,
          },
        }),
        axios.get(`${baseUrl}trades/all_history/`, {
          params: {
            user_signature: signature,
            user_address: address,
            environment: activeChain.id,
          },
        }),
      ]);
      const [activeTrades, limitOrders] = response.map((r) => r.data);
      return [activeTrades, limitOrders] as OngoingTradeSchema[];
    },
    refreshInterval: 10,
  });
  return data || ([[], []] as OngoingTradeSchema[][]);
};

export { usePlatformTrades };
