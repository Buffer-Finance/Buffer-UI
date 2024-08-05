import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useProducts } from '@Views/AboveBelow/Hooks/useProductName';

export interface Spread {
  spread: number;
  spread_sign_expiration: number;
  spread_signature: string;
}

export interface IAllSpreads {
  [key: string]: Spread;
}

export const useSpread = () => {
  const { activeChain } = useActiveChain();
  const toastify = useToast();
  const products = useProducts();
  async function fetchSpread(activeChainId: number | undefined) {
    try {
      if (!activeChainId) throw new Error('No active chain');
      const { data, status } = await axios.get(baseUrl + 'spread/', {
        params: {
          environment: activeChainId,
          product_id: products.UP_DOWN.product_id,
        },
      });
      if (status !== 200) {
        throw new Error('Could not fetch spread');
      }
      return data;
    } catch (e) {
      // toastify({
      //   type: 'error',
      //   msg: 'Could not fetch spread ' + (e as Error).message,
      //   id: 'spread api error',
      // });
      return null;
    }
  }

  return useSWR<IAllSpreads>([activeChain, 'spread'], {
    fetcher: () => fetchSpread(activeChain.id),
    refreshInterval: 5000,
  });
};
