import axios from 'axios';
import useSWR from 'swr';

export const DeregisteredAccountsQueryTest = () => {
  const { data } = useSWR('test', {
    fetcher: async () => {
      const query = `{
            deregisteredAccounts(
              first: 10000
              where: {
              updatedAt_gte: "0",
              }) {
                    eoa
                    nonce
                    updatedAt
                }
              }`;

      const res = await axios.post(
        `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/instant-trading-arbitrum-testnet/api
            `,
        {
          query,
        }
      );
      return res;
    },
  });
  console.log(data);
  return <></>;
};
