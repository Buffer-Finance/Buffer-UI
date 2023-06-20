import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer } from 'ethers';
import { OngoingTradeSchema } from '../type';
import { getSingatureCached } from '../cahce';

const useHistoryTrades = (): OngoingTradeSchema[][] => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  console.log(`hhoneCTWallet: `, oneCTWallet);
  const { address } = useAccount();
  const { data, error } = useSWR<OngoingTradeSchema[]>(
    'history-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        console.log(
          `'history-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address: `,
          'history-trades-' +
            address +
            '-' +
            activeChain.id +
            '-' +
            oneCTWallet?.address
        );
        const signature = await getSingatureCached(oneCTWallet);
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
    }
  );
  return data || ([[]] as OngoingTradeSchema[][]);
};

export { useHistoryTrades };
