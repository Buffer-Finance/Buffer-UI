import { useActiveChain } from '@Hooks/useActiveChain';
import { upDOwnV3BaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

export const useUserOneCTData = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const { data } = useSWR<{
    one_ct: string;
    nonce: number;
    state: 'PROCESSED' | 'PENDING';
  }>(`${userAddress}-one-ct-data-on-${activeChainId}`, {
    fetcher: async () => {
      if (!userAddress || !activeChainId) return null;
      try {
        const response = await axios.get(
          upDOwnV3BaseUrl +
            `user/onc_ct/?environment=${activeChainId}&user=${userAddress}`
        );
        return response.data;
      } catch (e) {
        console.log('useUserOneCTData-Error:', e);
        return null;
      }
    },
    refreshInterval: 1000,
  });

  return data;

  // console.log(data, 'useUserOneCTData-response');
};
