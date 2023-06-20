import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer, Wallet } from 'ethers';
import { OngoingTradeSchema } from '../type';
import { getSingatureCached } from '../cahce';
export enum TradeState {
  Queued = 'QUEUED',
  Active = 'ACTIVE',
}

const useOngoingTrades = () => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const { data, error } = useSWR<OngoingTradeSchema[][]>(
    'active-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        if (!oneCTWallet) return [[], []] as OngoingTradeSchema[][];
        console.time('generating-signature');
        const signature = await getSingatureCached(oneCTWallet);
        console.timeEnd('generating-signature');
        console.log(`signature: `, signature);
        // console.log(`ssssignature: `, signature);
        const res = await axios.get(`${baseUrl}trades/user/active/`, {
          params: {
            user_signature: signature,
            user_address: address,
            environment: activeChain.id,
          },
        });
        if (!res?.data?.length) return [[], []];
        // limitOrders
        const limitOrders = res.data.filter(
          (t: any) => t.is_limit_order && t.state === 'QUEUED'
        );
        const activeTrades = res.data.filter(
          (t: any) =>
            !t.is_limit_order || (t.is_limit_order && t.state !== 'QUEUED')
        );
        // console.log(`activeTrades: `, activeTrades, limitOrders);
        return [activeTrades, limitOrders] as OngoingTradeSchema[];
      },
      refreshInterval: 10,
    }
  );
  return data || ([[], []] as OngoingTradeSchema[][]);
};

export { useOngoingTrades };
