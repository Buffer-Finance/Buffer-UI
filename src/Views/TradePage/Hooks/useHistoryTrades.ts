import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer } from 'ethers';
import { OngoingTradeSchema } from '../type';

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

const useHistoryTrades = (): OngoingTradeSchema[][] => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { data: oneCTWallet } = useSigner({ chainId: activeChain.id });
  const { address } = useAccount();
  const { data, error } = useSWR<OngoingTradeSchema[]>('i am the history', {
    fetcher: async (oneCTWallet) => {
      const signature = await getCachedSignature(oneCTWallet);
      console.log(`ssssignature: `, signature);
      const res = await axios.get(`${baseUrl}trades/user/history/`, {
        params: {
          user_signature: signature,
          user_address: address,
          environment: activeChain.id,
        },
      });
      if (!res?.data?.length) return [[]];
      const activeTrades = res.data.filter((t: any) => !t.is_limit_order);
      const limitOrders = res.data.filter((t: any) => t.is_limit_order);
      console.log(`activeTrades: `, activeTrades, limitOrders);
      return [res.data] as OngoingTradeSchema[];
    },
    refreshInterval: 10,
  });
  return data || ([[]] as OngoingTradeSchema[][]);
};

export { useHistoryTrades };
