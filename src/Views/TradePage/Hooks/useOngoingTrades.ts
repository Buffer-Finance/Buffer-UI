import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl, refreshInterval } from '../config';
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { TradeType } from '../type';
import { getSingatureCached } from '../cache';
import { useMarketsConfig } from './useMarketsConfig';
import { addMarketInTrades } from '../utils';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getAddress } from 'viem';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
export enum TradeState {
  Queued = 'QUEUED',
  Active = 'ACTIVE',
}

const useOngoingTrades = () => {
  // const { oneCTWallet } = useOneCTWallet();
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address: userAddress } = useUserAccount();
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
        if (!userAddress) return [[], []] as TradeType[][];
        if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id as 42161))
          return [[], []];
        let currentUserSignature = null;
        if (userAddress === address)
          currentUserSignature = await getSingatureCached(oneCTWallet);
        // console.log(`signature: `, signature);

        const res = await axios.get(`${baseUrl}trades/user/active/`, {
          params: {
            user_signature: currentUserSignature,
            user_address: getAddress(userAddress),
            environment: activeChain.id,
          },
        });
        if (!res?.data?.length || !markets?.length) return [[], []];
        // limitOrders
        const limitOrders = res.data.filter(
          (t: any) => t.is_limit_order && t.state === 'QUEUED'
        );
        const activeTrades = res.data.filter(
          (t: any) =>
            !t.is_limit_order || (t.is_limit_order && t.state !== 'QUEUED')
        );
        // console.log(`activeTrades: `, activeTrades, limitOrders);
        // console.log(`markets: `, markets);
        return [
          addMarketInTrades(activeTrades, markets),
          addMarketInTrades(limitOrders, markets),
        ] as TradeType[][];
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || ([[], []] as TradeType[][]);
};

export { useOngoingTrades };
