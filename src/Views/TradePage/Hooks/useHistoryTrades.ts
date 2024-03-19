import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import useSWR from 'swr';
import { getAddress } from 'viem';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { historyTableActivePage } from '../atoms';
import {
  TRADE_IN_A_PAGE_TRADES_TABLES,
  baseUrl,
  refreshInterval,
} from '../config';
import { tradesApiResponseType } from '../type';
import { addMarketInTrades } from '../utils';
import { useAllV2_5MarketsConfig } from './useAllV2_5MarketsConfig';
const defaultRes = { page_data: [], total_pages: 1 };
const useHistoryTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const markets = useAllV2_5MarketsConfig();
  // console.log(`markets: `, markets);
  const activePage = useAtomValue(historyTableActivePage);
  // const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR<tradesApiResponseType>(
    'history-trades-' + address + '-' + activeChain.id + '-' + activePage,
    {
      fetcher: async () => {
        if (!address || !activeChain.id || !markets)
          return { page_data: [], total_pages: 1 };
        if (
          ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
            activeChain.id as 42161
          )
        )
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(`${baseUrl}trades/user/history/`, {
          params: {
            user_address: getAddress(address),
            environment: activeChain.id,
            limit: TRADE_IN_A_PAGE_TRADES_TABLES,
            page: activePage - 1,
          },
        });
        // console.log(
        //   `addMarketInTrades(res.data.page_data, markets): `,
        //   addMarketInTrades(res.data.page_data, markets)
        // );
        // if (!res?.data?.page_data?.length)
        // setIsLoading(false);
        // console.log(res, 'history');
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
  return data || defaultRes;
};

export { useHistoryTrades };
