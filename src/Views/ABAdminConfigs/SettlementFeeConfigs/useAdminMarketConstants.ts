import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { baseUrl } from '@Views/ABTradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { IMarketConstantsResponse } from './types';

export const useAdminMarketConstants = () => {
  const { activeChain } = useActiveChain();
  const toastify = useToast();

  const fetcher = async () => {
    try {
      const res = await axios.get(baseUrl + 'admin/market_constants/', {
        params: { environment: activeChain.id },
      });
      return res.data;
    } catch (err) {
      console.log(err);
      toastify({
        msg: 'Error while fetching market constants' + err,
        type: 'error',
        id: 'market-constants-admin',
      });
    }
  };

  return useSWR<IMarketConstantsResponse>(`environment-${activeChain.id}`, {
    fetcher,
    refreshInterval: 1000 * 60 * 60,
  });
};
