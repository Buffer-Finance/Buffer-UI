import { useActiveChain } from '@Hooks/useActiveChain';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import { aboveBelowMarketsAtom } from '@Views/AboveBelow/atoms';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import {
  platformActiveTableActivePage,
  platformCancelTableActivePage,
  platformHistoryTableActivePage,
} from '../atoms';
import {
  TRADE_IN_A_PAGE_TRADES_TABLES,
  refreshInterval,
  aboveBelowBaseUrl,
} from '../config';
import { tradesApiResponseType } from '../type';
import { addMarketInTrades } from '../utils';

export const usePlatformActiveTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const activePage = useAtomValue(platformActiveTableActivePage);
  const { data: productNames } = useProductName();

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-active-trades-ab' +
      address +
      '-' +
      activeChain.id +
      '-' +
      activePage,
    {
      fetcher: async () => {
        if (!markets || !productNames)
          return { page_data: undefined, total_pages: 1 };

        if (
          ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
            activeChain.id as 42161
          )
        )
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${aboveBelowBaseUrl}trades/all_active/`, {
          params: {
            user_address: address,
            environment: activeChain.id,
            limit: TRADE_IN_A_PAGE_TRADES_TABLES,
            page: activePage - 1,
            product_id: productNames['AB'].product_id,
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
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const { data: productNames } = useProductName();

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-history-trades-ab' +
      address +
      '-' +
      activeChain.id +
      '-' +
      activePage,
    {
      fetcher: async () => {
        if (!markets || !productNames)
          return { page_data: undefined, total_pages: 1 };
        if (
          ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
            activeChain.id as 42161
          )
        )
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${aboveBelowBaseUrl}trades/all_history/`, {
          params: {
            user_address: address,
            environment: activeChain.id,
            limit: TRADE_IN_A_PAGE_TRADES_TABLES,
            page: activePage - 1,
            product_id: productNames['AB'].product_id,
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
  const activePage = useAtomValue(platformCancelTableActivePage);
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const { data: productNames } = useProductName();

  const { data, error } = useSWR<tradesApiResponseType>(
    'platform-cancelled-trades-ab' +
      address +
      '-' +
      activeChain.id +
      '-' +
      activePage,
    {
      fetcher: async () => {
        if (!markets || !productNames)
          return { page_data: undefined, total_pages: 1 };
        if (
          ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
            activeChain.id as 42161
          )
        )
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(
          `${aboveBelowBaseUrl}trades/all_cancelled/`,
          {
            params: {
              user_address: address,
              environment: activeChain.id,
              limit: TRADE_IN_A_PAGE_TRADES_TABLES,
              page: activePage - 1,
              product_id: productNames['AB'].product_id,
            },
          }
        );
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
