import axios from 'axios';
import useSWR from 'swr';
import { useMarketsConfig } from './useMarketsConfig';

const usePriceChange = () => {
  const markets = useMarketsConfig();
  const { data } = useSWR(`4h-change-${markets?.length}`, {
    fetcher: async () => {
      if (!markets) return;

      const pythIdsToTvId: { [pythId: string]: string } = {};
      markets?.forEach((market) => {
        pythIdsToTvId[market.pythId.slice(2)] = market.tv_id;
      });
      // pythIds.push(market.pythId.slice(2))
      console.log('pythIds', pythIdsToTvId);

      const currentTime = Math.floor(new Date().getTime() / 1000);
      const { data } = await axios.get(
        `https://hermes.pyth.network/v2/updates/price/${
          currentTime - 60
        }?${Object.keys(pythIdsToTvId)
          .map((id) => `ids%5B%5D=${id}`)
          .join('&')}`
      );
      console.log('pythIds-data', data);

      const queries: string[] = [];

      markets?.forEach((market) => queries.push(market.tv_id));

      // const { data: response } = await axios.post(
      //   pricePublisherBaseUrl + 'bulk_24h_change/',
      //   queries
      // );
      const finalResponse: {
        [key: string]: {
          pair: string;
          change: number;
        };
      } = {};

      data[0].parsed.forEach((res:))

      // response.forEach((res: { pair: string; change: number }) => {
      //   finalResponse[res.pair] = {
      //     pair: res.pair,
      //     change: res.change,
      //   };
      // });
      return finalResponse;
    },
    refreshInterval: 1000 * 60 * 5,
  });

  return data;
};

export { usePriceChange };
