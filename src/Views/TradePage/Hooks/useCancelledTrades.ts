import axios from 'axios';
import useSWR from 'swr';
import {
  TRADE_IN_A_PAGE_TRADES_TABLES,
  baseUrl,
  refreshInterval,
} from '../config';
import { useActiveChain } from '@Hooks/useActiveChain';
import { tradesApiResponseType } from '../type';
import { useMarketsConfig } from './useMarketsConfig';
import { addMarketInTrades } from '../utils';
import { useAtomValue } from 'jotai';
import { cancelTableActivePage } from '../atoms';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getAddress } from 'viem';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';

const useCancelledTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const markets = useMarketsConfig();
  const activePage = useAtomValue(cancelTableActivePage);

  const { data, error } = useSWR<tradesApiResponseType>(
    'cancelled-trades-' + address + '-' + activeChain.id + '-' + activePage,
    {
      fetcher: async () => {
        if (!address)
          return { page_data: [], total_pages: 1 } as tradesApiResponseType;
        if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id as 42161))
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${baseUrl}trades/user/cancelled/`, {
          params: {
            user_address: getAddress(address),
            environment: activeChain.id,
            limit: TRADE_IN_A_PAGE_TRADES_TABLES,
            page: activePage - 1,
          },
        });
        if (!res?.data?.page_data?.length)
          return { page_data: [], total_pages: 1 };
        return {
          ...res.data,
          page_data: addMarketInTrades(res.data.page_data, markets),
        } as tradesApiResponseType;
      },
      refreshInterval,
    }
  );
  return data || { page_data: undefined, total_pages: 1 };
};

export { useCancelledTrades };
