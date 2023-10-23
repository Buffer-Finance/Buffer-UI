import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import useSWR from 'swr';
import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { getSingatureCached } from '../cache';
import { baseUrl, refreshInterval } from '../config';
import { TradeType } from '../type';
import { addMarketInTrades } from '../utils';
import { useAllV2_5MarketsConfig } from './useAllV2_5MarketsConfig';
import { useState } from 'react';
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
  const [empty, setEmpty] = useState([[], []]);
  const markets = useAllV2_5MarketsConfig();
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
        console.log(`userAddress: `, userAddress, address);
        if (userAddress === address)
          currentUserSignature = await getSingatureCached(oneCTWallet);

        const res = await axios.get(`${baseUrl}trades/user/active/`, {
          params: {
            user_address: getAddress(userAddress),
            environment: activeChain.id,
          },
        });
        console.log(`markets: `, markets);
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
  return data || empty;
};

export { useOngoingTrades };
