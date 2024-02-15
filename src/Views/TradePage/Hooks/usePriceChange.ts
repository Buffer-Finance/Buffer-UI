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

      const currentTime = Math.floor(new Date().getTime() / 1000);
      const { data: currentPrices } = await axios.get(
        `https://hermes.pyth.network/v2/updates/price/${
          currentTime - 60
        }?${Object.keys(pythIdsToTvId)
          .map((id) => `ids%5B%5D=${id}`)
          .join('&')}`
      );

      const { data: pastDayPrices } = await axios.get(
        `https://hermes.pyth.network/v2/updates/price/${
          currentTime - 60 * 60 * 24
        }?${Object.keys(pythIdsToTvId)
          .map((id) => `ids%5B%5D=${id}`)
          .join('&')}`
      );

      // const queries: string[] = [];

      // markets?.forEach((market) => queries.push(market.tv_id));

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

      const currentResponse: {
        [key: string]: {
          id: string;
          price: number;
        };
      } = {};

      const pastDayResponse: {
        [key: string]: {
          id: string;
          price: number;
        };
      } = {};

      currentPrices[0].parsed.forEach(
        (res: { id: string; price: { price: number } }) => {
          currentResponse[pythIdsToTvId[res.id]] = {
            id: pythIdsToTvId[res.id],
            price: res.price.price,
          };
        }
      );

      pastDayPrices[0].parsed.forEach(
        (res: { id: string; price: { price: number } }) => {
          pastDayResponse[pythIdsToTvId[res.id]] = {
            id: pythIdsToTvId[res.id],
            price: res.price.price,
          };
        }
      );

      markets?.forEach((market) => {
        const currentPrice = currentResponse[market.tv_id].price;
        const pastDayPrice = pastDayResponse[market.tv_id].price;
        finalResponse[market.tv_id] = {
          pair: market.tv_id,
          change: ((currentPrice - pastDayPrice) / pastDayPrice) * 100,
        };
      });

      return finalResponse;
    },
    refreshInterval: 1000 * 60 * 5,
  });

  return data;
};

export { usePriceChange };
