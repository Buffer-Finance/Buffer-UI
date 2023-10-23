import axios from 'axios';
import useSWR from 'swr';
import { pricePublisherBaseUrl } from '../config';
import { useMarketsConfig } from './useMarketsConfig';

const usePriceChange = () => {
  const markets = useMarketsConfig();
  const { data } = useSWR(`4h-change-${markets?.length}`, {
    fetcher: async () => {
      if (!markets) return;

      const queries: string[] = [];

      markets?.forEach((market) => queries.push(market.tv_id));

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

export { usePriceChange };
