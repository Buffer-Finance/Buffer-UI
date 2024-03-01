import { useActiveChain } from '@Hooks/useActiveChain';
import { selectedPoolActiveMarketAtom } from '@Views/AboveBelow/atoms';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import useSWR, { useSWRConfig } from 'swr';
import { useAccount } from 'wagmi';

export const useApprvalAmount = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const tokenName = activeMarket?.poolInfo.token;
  const { cache } = useSWRConfig();

  const id = `${userAddress}-user-approval-${activeChainId}-tokenName-${tokenName}`;

  const { data, mutate } = useSWR<{
    allowance: number;
    nonce: number;
    is_locked: boolean;
  }>(id, {
    fetcher: async () => {
      if (!userAddress || !activeChainId || !tokenName) return undefined;
      try {
        const { data, status } = await axios.get(
          baseUrl +
            `user/approval/?environment=${activeChainId}&user=${userAddress}&token=${tokenName}`
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
