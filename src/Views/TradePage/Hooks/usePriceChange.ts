import useSWR from 'swr';
import { marketsForChart, pricePublisherBaseUrl } from '../config';
import axios from 'axios';
// 25 - 41
const usePriceChange = () => {
  const { data } = useSWR('24h-change', {
    fetcher: async () => {
      // const nowEpoch = Math.round(Date.now() / 1000) - 5 * 60;
      // const yesterdayEpoch = nowEpoch - 60 * 60 * 24;
      const queries = [];
      for (const marketName in marketsForChart) {
        const market = (marketsForChart as any)[marketName];
        // queries.push(
        //   axios.post(pricePublisherBaseUrl, [
        //     {
        //       pair: market.tv_id,
        //       timestamp: nowEpoch,
        //     },
        //     {
        //       pair: market.tv_id,
        //       timestamp: yesterdayEpoch,
        //     },
        //   ])
        // );

        // queries.push(
        //   axios.get(
        //     pricePublisherBaseUrl + '24h_change/' + `?pair=${market.tv_id}`
        //   )
        // );

        queries.push(market.tv_id);
      }
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
          // now: res.data[0].price,
          // yesterday: res.data[1].price,
          pair: res.pair,
          change: res.change,
        };
      });
      return finalResponse;
    },
    refreshInterval: 1000 * 60 * 5,
  });

  // get markets from config

  // for each market, add 2 req, one of now, one of now - 24h.

  // when response arrived, calculate the change
  // console.log(data, 'usePriceCHanfedata');
  return data;
};

export { usePriceChange };
