import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '@Views/TradePage/config';
import axios from 'axios';
import useSWR from 'swr';
import { getLinuxTimestampBefore24Hours } from '../utils/getLinuxTimestampBefore24Hours';
import { useMemo } from 'react';
import { add } from '@Utils/NumString/stringArithmatics';

export const useOneDayVolume = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const graphqlURL = config.graph.MAIN;
  const { data } = useSWR('dashboard-table-data', {
    fetcher: async () => {
      const response = await axios.post(graphqlURL, {
        query: `{ 
              volumePerContracts(   
                orderBy: timestamp
                orderDirection: desc
                first: 10000
                where: { timestamp_gt: "${getLinuxTimestampBefore24Hours()}"}) {
                optionContract {
                  address
                }
                amount
                settlementFee
                depositToken
              }
            }`,
      });
      return response.data?.data as {
        volumePerContracts: {
          optionContract: {
            address: string;
          };
          amount: string;
          depositToken: string;
        }[];
      };
    },
    refreshInterval: 300,
  });

  const oneDayVolume = useMemo(() => {
    if (!data || !data.volumePerContracts) return {};
    const startObject: { [key: string]: string } = {};
    return data.volumePerContracts.reduce((acc, item) => {
      const address = item.optionContract.address.toLowerCase();
      if (item.depositToken !== 'total') {
        if (acc[address]) {
          acc[address] = add(acc[address], item.amount);
        } else {
          acc[address] = item.amount;
        }
      }
      return acc;
    }, startObject);
  }, [data]);

  return { oneDayVolume };
};
