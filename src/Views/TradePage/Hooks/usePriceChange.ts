import useSWR from 'swr';
import { marketsForChart, pricePublisherBaseUrl } from '../config';
import axios from 'axios';
import { PriceQuerySchema } from 'src/Interfaces/interfaces';
// 25 - 41
const usePriceChange = () => {
  const { data, error } = useSWR('24h-change', {
    fetcher: async () => {
      const nowEpoch = Math.round(Date.now() / 1000) - 3;
      const yesterdayEpoch = nowEpoch - 60 * 60 * 24;
      let queries: PriceQuerySchema[] = [];
      for (const marketName in marketsForChart) {
        const market = (marketsForChart as any)[marketName];
        queries = [
          ...queries,
          ...[
            {
              pair: market.tv_id,
              timestamp: nowEpoch,
            },
            {
              pair: market.tv_id,
              timestamp: yesterdayEpoch,
            },
          ],
        ];
      }
      const response = await axios.post(pricePublisherBaseUrl, queries);
      const finalResponse: {
        [key: string]: {
          now: number;
          yesterday: number;
          change?: number;
        };
      } = {};

      console.log(`response: `, response);
      response.data.forEach((res) => {
        if (!finalResponse?.[res.pair]) {
          finalResponse[res.pair] = {};
        }
        if (res.timestamp == nowEpoch) {
          finalResponse[res.pair].now = res.price;
        } else {
          finalResponse[res.pair].yesterday = res.price;
        }
      });
      console.log(`finalResponse: `, finalResponse);
      for (const key in finalResponse) {
        if (finalResponse[key].now && finalResponse[key].yesterday) {
          finalResponse[key].change =
            ((finalResponse[key].now - finalResponse[key].yesterday) /
              finalResponse[key].yesterday) *
            100;
        }
      }
      console.log(`finalResponse: `, finalResponse);

      return finalResponse;
    },
    refreshInterval: 1000 * 60 * 5,
  });

  // get markets from config

  // for each market, add 2 req, one of now, one of now - 24h.

  // when response arrived, calculate the change
  console.log(`error: `, error);

  return data;
};

export { usePriceChange };
