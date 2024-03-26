import { pricePublisherBaseUrl } from '@Views/ABTradePage/config';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { aboveBelowMarketsAtom } from '../atoms';

export const usePriceChangeAboveBelow = () => {
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const { data } = useSWR(`aboe-below-4h-change-${markets?.length}`, {
    fetcher: async () => {
      if (!markets) return;

      const queries = [...new Set<string>()];

      markets?.forEach((market) => queries.push(market.tv_id));
      //remove duplicate queries

      const { data: response } = await axios.post(
        pricePublisherBaseUrl + 'bulk_24h_change/',
        queries
      );
      const finalResponse: {
        [key: string]: {
          pair: string;
          change: number;
        };
      } = {};

      response.forEach((res: { pair: string; change: number }) => {
        finalResponse[res.pair] = {
          pair: res.pair,
          change: res.change,
        };
      });
      return finalResponse;
    },
    refreshInterval: 1000 * 60 * 5,
  });

  return data;
};
