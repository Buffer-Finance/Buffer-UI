import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import { aboveBelowBaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

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
      if (productNames === undefined) return;

      if (!userAddress || !activeChainId) return null;
      try {
        const response = await axios.get(
          aboveBelowBaseUrl +
            `user/onc_ct/?environment=${activeChainId}&user=${userAddress}&product_id=${productNames['UP_DOWN']}`
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
