import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
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
import { useAtomValue } from 'jotai';
import {
  platformActiveTableActivePage,
  platformHistoryTableActivePage,
} from '../atoms';
import { addMarketInTrades } from '../utils';
import { useMarketsConfig } from './useMarketsConfig';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';

export const usePlatformActiveTrades = () => {
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const markets = useMarketsConfig();
  const activePage = useAtomValue(platformActiveTableActivePage);

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-active-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address +
      '-' +
      activePage,
    {
      fetcher: async () => {
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
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const activePage = useAtomValue(platformHistoryTableActivePage);
  const markets = useMarketsConfig();

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-history-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address +
      '-' +
      activePage,
    {
      fetcher: async () => {
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
