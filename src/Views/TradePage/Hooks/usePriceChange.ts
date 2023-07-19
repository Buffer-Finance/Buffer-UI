import useSWR from 'swr';
import { marketsForChart, pricePublisherBaseUrl } from '../config';
import axios from 'axios';
// 25 - 41
const usePriceChange = () => {
  const { data } = useSWR('24h-change', {
    fetcher: async () => {
      const nowEpoch = Math.round(Date.now() / 1000) - 5 * 60;
      const yesterdayEpoch = nowEpoch - 60 * 60 * 24;
      const queries = [];
      for (const marketName in marketsForChart) {
        const market = (marketsForChart as any)[marketName];
        queries.push(
          axios.post(pricePublisherBaseUrl, [
            {
              pair: market.tv_id,
              timestamp: nowEpoch,
            },
            {
              pair: market.tv_id,
              timestamp: yesterdayEpoch,
            },
          ])
        );
      }
      const response = await Promise.all(queries);
      const finalResponse: {
        [key: string]: {
          now: number;
          yesterday: number;
          change: number;
        };
      } = {};
      response.forEach((res) => {
        finalResponse[res.data[0].pair] = {
          now: res.data[0].price,
          yesterday: res.data[1].price,
          change:
            ((res.data[0].price - res.data[1].price) / res.data[1].price) * 100,
        };
      });
      return finalResponse;
    },
    refreshInterval: 1000 * 60 * 5,
  });

  // get markets from config

  // for each market, add 2 req, one of now, one of now - 24h.

  // when response arrived, calculate the change

  return data;
};

export { usePriceChange };