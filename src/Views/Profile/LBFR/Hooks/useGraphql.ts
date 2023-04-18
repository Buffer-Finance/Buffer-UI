import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

export const useLBFRGraphql = () => {
  const { configContracts } = useActiveChain();
  const { address: account } = useAccount();

  const { data } = useSWR(`LBFR-graphql-query-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
            lbfrstatsPerUsers(where: {userAddress: "${account}"}) {
                lBFRAlloted
                period
                timestamp
                volume
                volumeUSDC
                volumeARB
              }
              claimedLBFRPerUsers(where: {userAddress: "${account}"}) {
                lBFRClaimed
                timestamp
              }
        }`,
      });
      return response.data?.data as {};
    },
    refreshInterval: 300,
  });
  console.log(data, 'data');
  return {};
};
