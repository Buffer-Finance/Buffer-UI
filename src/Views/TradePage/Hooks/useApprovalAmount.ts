import { useActiveChain } from '@Hooks/useActiveChain';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR, { useSWRConfig } from 'swr';
import { useAccount } from 'wagmi';
import { useSwitchPool } from './useSwitchPool';
import { useProducts } from '@Views/AboveBelow/Hooks/useProductName';

export const useApprvalAmount = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const { poolDetails } = useSwitchPool();
  const tokenName = poolDetails?.token;
  const { cache } = useSWRConfig();
  const products = useProducts();
  const id = `${userAddress}-user-approval-${activeChainId}-tokenName-${tokenName}`;

  const { data, mutate } = useSWR<{
    allowance: number;
    nonce: number;
    is_locked: boolean;
  }>(id, {
    fetcher: async () => {
      if (!userAddress || !activeChainId || !tokenName) return null;
      try {
        const { data, status } = await axios.get(
          baseUrl +
            `user/approval/?environment=${activeChainId}&user=${userAddress}&token=${tokenName}&product_id=${products.UP_DOWN.product_id}`
        );
        if (status !== 200) return cache.get(id);
        return data;
      } catch (e) {
        return cache.get(id);
      }
    },
    refreshInterval: 100,
  });

  return { data, mutate };

  // console.log(data, 'useApprvalAmount-response');
};
