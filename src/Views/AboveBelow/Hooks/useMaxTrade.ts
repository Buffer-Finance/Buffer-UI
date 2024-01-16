import { useActiveChain } from '@Hooks/useActiveChain';
import { upDownV2BaseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { marketTypeAB } from '../types';

export const useMaxTrade = ({
  activeMarket,
  expiry,
}: {
  expiry: number | undefined;
  activeMarket: marketTypeAB | undefined;
}) => {
  const { activeChain } = useActiveChain();
  console.log('useMaxTrade', activeMarket, expiry);
  return useSWR<{
    [marketId: string]: number;
  }>([activeMarket?.address, expiry, 'up-down-max-trade'], {
    fetcher: async () => {
      if (!activeChain?.id || !activeMarket || !expiry) return null;
      const response = await axios.get(upDownV2BaseUrl + `max_size/`, {
        params: {
          environment: activeChain.id,
          market_ids: activeMarket?.address + '-' + expiry / 1000,
          pools: activeMarket?.pool,
        },
      });
      if (response?.data) {
        return response.data;
      }
      return null;
    },
    refreshInterval: 1000,
  });
};
