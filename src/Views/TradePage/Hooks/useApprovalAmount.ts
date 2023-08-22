import { useActiveChain } from '@Hooks/useActiveChain';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { useSwitchPool } from './useSwitchPool';

export const useApprvalAmount = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const { poolDetails } = useSwitchPool();
  const tokenName = poolDetails?.token;

  const { data, mutate } = useSWR<{
    allowance: number;
    nonce: number;
    is_locked: boolean;
  }>(`${userAddress}-user-approval-${activeChainId}-tokenName-${tokenName}`, {
    fetcher: async () => {
      if (!userAddress || !activeChainId || !tokenName) return null;
      try {
        const response = await axios.get(
          baseUrl +
            `user/approval/?environment=${activeChainId}&user=${userAddress}&token=${tokenName}`
        );
        return response.data;
      } catch (e) {
        console.log('useApprvalAmount-Error:', e);
        return null;
      }
    },
    refreshInterval: 100,
  });

  return { data, mutate };

  // console.log(data, 'useApprvalAmount-response');
};
