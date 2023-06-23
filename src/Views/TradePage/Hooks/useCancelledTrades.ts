import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { Signer, Wallet } from 'ethers';
import { OngoingTradeSchema, TradeType } from '../type';
import { getSingatureCached } from '../cahce';
import { useMarketsConfig } from './useMarketsConfig';
import { addMarketInTrades } from '../utils';

const useCancelledTrades = () => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const markets = useMarketsConfig();
  const { data, error } = useSWR<TradeType[][]>(
    'cancleed-trades-' + address + '-' + activeChain.id,
    {
      fetcher: async () => {
        if (!oneCTWallet) return [[], []] as OngoingTradeSchema[][];
        const res = await axios.get(`${baseUrl}trades/user/cancelled/`, {
          params: {
            user_address: address,
            environment: activeChain.id,
          },
        });
        if (!res?.data?.length) return [[], []];

        // console.log(`activeTrades: `, activeTrades, limitOrders);
        return [addMarketInTrades(res.data, markets)] as TradeType[][];
      },
      refreshInterval: 10,
    }
  );
  return data || ([[], []] as TradeType[][]);
};

export { useCancelledTrades };
