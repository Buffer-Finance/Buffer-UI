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
        return [
          addMarketInTrades(activeTrades, markets),
          addMarketInTrades(limitOrders, markets),
        ] as TradeType[][];
      },
      refreshInterval: 10,
    }
  );
  return data || ([[], []] as TradeType[][]);
};

export { useCancelledTrades };
