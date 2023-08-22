import axios from 'axios';
import useSWR from 'swr';
import {
  TRADE_IN_A_PAGE_TRADES_TABLES,
  baseUrl,
  refreshInterval,
} from '../config';
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { tradesApiResponseType } from '../type';
import { addMarketInTrades } from '../utils';
import { useMarketsConfig } from './useMarketsConfig';
import { historyTableActivePage } from '../atoms';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

const useHistoryTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const markets = useMarketsConfig();
  const activePage = useAtomValue(historyTableActivePage);
  // const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR<tradesApiResponseType>(
    'history-trades-' + address + '-' + activeChain.id + '-' + activePage,
    {
      fetcher: async () => {
        if (!address || !activeChain.id)
          return { page_data: [], total_pages: 1 };
        // setIsLoading(true);
        const res = await axios.get(`${baseUrl}trades/user/history/`, {
          params: {
            user_address: address,
            environment: activeChain.id,
            limit: TRADE_IN_A_PAGE_TRADES_TABLES,
            page: activePage - 1,
          },
        });
        // setIsLoading(false);
        console.log(res, 'history');
        // if (!res?.data?.page_data === undefined)
        //   return { page_data: null, total_pages: 1 };
        if (res.data.page_data.length === 0)
          return { page_data: [], total_pages: 1 };
        return {
          ...res.data,
          page_data: addMarketInTrades(res.data.page_data, markets),
        } as tradesApiResponseType;
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || { page_data: undefined, total_pages: 1 };
};

export { useHistoryTrades };
