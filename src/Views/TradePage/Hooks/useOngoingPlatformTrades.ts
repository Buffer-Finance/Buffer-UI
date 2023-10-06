import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import {
  platformActiveTableActivePage,
  platformHistoryTableActivePage,
} from '../atoms';
import {
  TRADE_IN_A_PAGE_TRADES_TABLES,
  baseUrl,
  refreshInterval,
} from '../config';
import { tradesApiResponseType } from '../type';
import { addMarketInTrades } from '../utils';
import { useAllV2_5MarketsConfig } from './useAllV2_5MarketsConfig';

export const usePlatformActiveTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const markets = useAllV2_5MarketsConfig();
  const activePage = useAtomValue(platformActiveTableActivePage);

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-active-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      activePage,
    {
      fetcher: async () => {
        if (!markets) return { page_data: undefined, total_pages: 1 };

        if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id as 42161))
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${baseUrl}trades/all_active/`, {
          params: {
            user_address: address,
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
      refreshInterval: refreshInterval,
    }
  );
  return data || { page_data: undefined, total_pages: 1 };
};

export const usePlatformHistoryTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const activePage = useAtomValue(platformHistoryTableActivePage);
  const markets = useAllV2_5MarketsConfig();
  // console.log('markets', markets);

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-history-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      activePage,
    {
      fetcher: async () => {
        if (!markets) return { page_data: undefined, total_pages: 1 };
        if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id as 42161))
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${baseUrl}trades/all_history/`, {
          params: {
            user_address: address,
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
      refreshInterval: refreshInterval,
    }
  );
  return data || { page_data: undefined, total_pages: 1 };
};

export const usePlatformCancelledTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const activePage = useAtomValue(platformHistoryTableActivePage);
  const markets = useAllV2_5MarketsConfig();
  // console.log('markets', markets);

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-cancelled-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      activePage,
    {
      fetcher: async () => {
        if (!markets) return { page_data: undefined, total_pages: 1 };
        if (![arbitrum.id, arbitrumGoerli.id].includes(activeChain.id as 42161))
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${baseUrl}trades/all_cancelled/`, {
          params: {
            user_address: address,
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
      refreshInterval: refreshInterval,
    }
  );
  return data || { page_data: undefined, total_pages: 1 };
};
