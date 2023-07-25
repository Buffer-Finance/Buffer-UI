import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl, refreshInterval } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { TradeType } from '../type';
import { addMarketInTrades } from '../utils';
import { useMarketsConfig } from './useMarketsConfig';

const useHistoryTrades = (): TradeType[][] => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const markets = useMarketsConfig();

  const { data, error } = useSWR<TradeType[][]>(
    'history-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        if (!address || !activeChain.id) return [[]];
        const res = await axios.get(`${baseUrl}trades/user/temp_history/`, {
          params: {
            user_address: address,
            environment: activeChain.id,
          },
        });
        if (!res?.data?.length) return [[]];
        return [addMarketInTrades(res.data, markets)] as TradeType[][];
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || ([[]] as TradeType[][]);
};

export { useHistoryTrades };
