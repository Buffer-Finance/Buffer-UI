import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import { aboveBelowMarketsAtom } from '@Views/AboveBelow/atoms';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import useSWR from 'swr';
import { getAddress } from 'viem';
import { useAccount } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { getSingatureCached } from '../cache';
import { refreshInterval, aboveBelowBaseUrl } from '../config';
import { TradeType } from '../type';
import { addMarketInTrades } from '../utils';
export enum TradeState {
  Queued = 'QUEUED',
  Active = 'ACTIVE',
}

const useOngoingTrades = () => {
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address: userAddress } = useUserAccount();
  const { address } = useAccount();
  const markets = useAtomValue(aboveBelowMarketsAtom);
  console.log(`markets: `, markets);
  const { data: productNames } = useProductName();
  const { data, error } = useSWR<TradeType[]>(
    'active-trades-ab-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        if (!userAddress || !productNames) return [] as TradeType[];
        if (
          ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
            activeChain.id as 42161
          )
        )
          return [];
        let currentUserSignature = null;
        if (userAddress === address)
          currentUserSignature = await getSingatureCached(oneCTWallet);

        const res = await axios.get(`${aboveBelowBaseUrl}trades/user/active/`, {
          params: {
            user_address: getAddress(userAddress),
            environment: activeChain.id,
            product_id: productNames['AB'].product_id,
          },
        });
        console.log(` useOngoingTrades res: `, res);

        if (!res?.data?.length || !markets?.length) return [];

        return addMarketInTrades(res.data, markets) as TradeType[];
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || [];
};

export { useOngoingTrades };
