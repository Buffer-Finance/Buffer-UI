import axios from 'axios';
import useSWR from 'swr';
const useARBPrice = () => {
  const { data, error } = useSWR('ETH-Price', {
    fetcher: async () => {
      //   const results = await axios.get(
      //     `https://bufferf-pythnet-4e5a.mainnet.pythnet.rpcpool.com/b6f0d8f7-97c2-4bb4-953c-5405fc9cd0ae/api/latest_price_feeds?ids[]=${ETHUSD}`
      //   );
      const coingekores = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arbitrum&vs_currencies=usd`
      );
      return coingekores.data.arbitrum.usd;
      //   console.log(`results.data: `, results.data);
      //   const price = BigInt(results.data[0].price.price);
      //   return absoluteInt(price, -results.data[0].price.expo);
    },
    refreshInterval: 500 * 1000,
  });

  return data;
};

export default useARBPrice;
