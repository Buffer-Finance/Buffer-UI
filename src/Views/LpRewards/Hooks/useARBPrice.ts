import axios from 'axios';
import useSWR from 'swr';
const useARBPrice = () => {
  const { data, error } = useSWR('ETH-Price', {
    fetcher: async () => {
      const coingekores = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arbitrum&vs_currencies=usd`
      );
      return coingekores.data.arbitrum.usd;
    },
    refreshInterval: 500 * 1000,
  });

  return data;
};

export default useARBPrice;
