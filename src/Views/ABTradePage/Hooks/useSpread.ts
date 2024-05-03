import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import useSWR from 'swr';
import { baseUrl } from '../config';
import { useProducts } from '@Views/AboveBelow/Hooks/useProductName';
const d = null;
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

  return { data: d, erro: d };
};
