import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import { aboveBelowMarketsAtom } from '@Views/AboveBelow/atoms';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import useSWR from 'swr';
import { getAddress } from 'viem';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { historyTableActivePage } from '../atoms';
import {
  TRADE_IN_A_PAGE_TRADES_TABLES,
  refreshInterval,
  aboveBelowBaseUrl,
} from '../config';
import { tradesApiResponseType } from '../type';
import { addMarketInTrades } from '../utils';
const defaultRes = { page_data: [], total_pages: 1 };

const useHistoryTrades = () => {
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const markets = useAtomValue(aboveBelowMarketsAtom);
  console.log(`markets: `, markets);
  // console.log(`markets: `, markets);
  const activePage = useAtomValue(historyTableActivePage);
  const { data: productNames } = useProductName();
  console.log(`productNames: `, productNames);
  // const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR<tradesApiResponseType>(
    'history-trades-ab' + address + '-' + activeChain.id + '-' + activePage,
    {
      fetcher: async () => {
        if (!address || !activeChain.id || !markets || !productNames)
          return { page_data: [], total_pages: 1 };
        if (
          ![arbitrum.id, arbitrumGoerli.id, arbitrumSepolia.id].includes(
            activeChain.id as 42161
          )
        )
          return { page_data: [], total_pages: 1 };
        const res = await axios.get(
          `${aboveBelowBaseUrl}trades/user/history/`,
          {
            params: {
              user_address: getAddress(address),
              environment: activeChain.id,
              limit: TRADE_IN_A_PAGE_TRADES_TABLES,
              page: activePage - 1,
              product_id: productNames['AB'].product_id,
            },
          }
        );
        console.log(`productNames: `, productNames['AB'].product_id);

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
