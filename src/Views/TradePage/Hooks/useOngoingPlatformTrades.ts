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
import { TradeType, tradesApiResponseType } from '../type';
import { useAtomValue } from 'jotai';
import {
  platformActiveTableActivePage,
  platformHistoryTableActivePage,
} from '../atoms';

const usePlatformTrades = () => {
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const { data, error } = useSWR<TradeType[][]>(
    'platform-trades-' +
      address +
      '-' +
      activeChain.id +
      '-' +
      oneCTWallet?.address,
    {
      fetcher: async () => {
        const response = await Promise.all([
          axios.get(`${baseUrl}trades/all_active/`, {
            params: {
              user_address: address,
              environment: activeChain.id,
            },
          }),
          axios.get(`${baseUrl}trades/all_history/`, {
            params: {
              user_address: address,
              environment: activeChain.id,
            },
          }),
        ]);
        const [activeTrades, historyTrades] = response.map((r) => r.data);
        return [activeTrades, historyTrades] as TradeType[][];
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || ([[], []] as TradeType[][]);
};

export { usePlatformTrades };

export const usePlatformActiveTrades = () => {
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
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
          page_data: res.data.page_data,
        } as tradesApiResponseType;
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || ({ page_data: [], total_pages: 1 } as tradesApiResponseType);
};

export const usePlatformHistoryTrades = () => {
  const { activeChain } = useActiveChain();
  const { oneCTWallet } = useOneCTWallet();
  const { address } = useAccount();
  const activePage = useAtomValue(platformHistoryTableActivePage);

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
          page_data: res.data.page_data,
        } as tradesApiResponseType;
      },
      refreshInterval: refreshInterval,
    }
  );
  return data || ({ page_data: [], total_pages: 1 } as tradesApiResponseType);
};
