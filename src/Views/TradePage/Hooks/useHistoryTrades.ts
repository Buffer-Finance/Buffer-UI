import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl, refreshInterval } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer } from 'ethers';
import { TradeType } from '../type';
import { getSingatureCached } from '../cahce';

const useHistoryTrades = (): TradeType[][] => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const { data, error } = useSWR<TradeType[]>(
    'history-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        if (!address || !activeChain.id) return [[]];
        const res = await axios.get(`${baseUrl}trades/user/history/`, {
          params: {
            user_address: address,
            environment: activeChain.id,
          },
        });
        if (!res?.data?.length) return [[]];
        const activeTrades = res.data.filter((t: any) => !t.is_limit_order);
        const limitOrders = res.data.filter((t: any) => t.is_limit_order);
        return [res.data] as TradeType[];
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || ([[]] as TradeType[][]);
};

export { useHistoryTrades };
