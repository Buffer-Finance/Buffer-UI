import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import { aboveBelowBaseUrl, baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { oldBaseURL } from './useOneCTWallet';

export const useUserOneCTData = () => {
  const { activeChain } = useActiveChain();
  const activeChainId = activeChain?.id;
  const { address: userAddress } = useAccount();
  const { data: productNames } = useProductName();
  const toastify = useToast();

  const { data } = useSWR<{
    one_ct: string;
    nonce: number;
    state: 'PROCESSED' | 'PENDING';
  }>(`${userAddress}-one-ct-data-on-${activeChainId}`, {
    fetcher: async () => {
      // if (productNames === undefined)
      //   return toastify({
      //     id: '10231',
      //     type: 'error',
      //     msg: 'Product name not found.',
      //   });
      if (!userAddress || !activeChainId) return null;
      try {
        const response = await axios.get(
          oldBaseURL +
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
