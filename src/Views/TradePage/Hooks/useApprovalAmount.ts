import { useActiveChain } from '@Hooks/useActiveChain';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

export const useApprvalAmount = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const { data } = useSWR<{ allowance: number; nonce: number }>(
    `${userAddress}-user-approval-${activeChainId}`,
    {
      fetcher: async () => {
        if (!userAddress || !activeChainId) return null;
        try {
          const response = await axios.get(
            baseUrl +
              `user/approval/?environment=${activeChainId}&user=${userAddress}`
          );
          return response.data;
        } catch (e) {
          console.log('useApprvalAmount-Error:', e);
          return null;
        }
      },
      refreshInterval: 100,
    }
  );

  return data;

  // console.log(data, 'useApprvalAmount-response');
};
