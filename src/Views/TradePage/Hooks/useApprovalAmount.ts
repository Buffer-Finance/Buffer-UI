import { useActiveChain } from '@Hooks/useActiveChain';
import { ABBaseURL, baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR, { useSWRConfig } from 'swr';
import { useAccount } from 'wagmi';
import { useSwitchPool } from './useSwitchPool';

export const useApprvalAmount = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const { poolDetails } = useSwitchPool();
  const tokenName = poolDetails?.token;
  const { cache } = useSWRConfig();

  const id = `${userAddress}-user-approval-${activeChainId}-tokenName-${tokenName}`;

  const { data, mutate } = useSWR<{
    allowance: number;
    nonce: number;
    is_locked: boolean;
  }>(id, {
    fetcher: async () => {
      console.log('fetcher', userAddress, activeChainId, tokenName);
      if (!userAddress || !activeChainId || !tokenName) return null;
      try {
        const { data, status } = await axios.get(
          ABBaseURL +
            `user/approval/?environment=${activeChainId}&user=${userAddress}&token=${tokenName}`
        );
        console.log(`data: `, data);
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
// v2-v3 is not straight forward because there are certain details are required on top of UP/Down source code.
// Change Approval flow
// Change Buying flow
// Test
// Mobile changes
