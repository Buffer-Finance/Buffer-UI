import { useActiveChain } from '@Hooks/useActiveChain';
import { add } from '@Utils/NumString/stringArithmatics';
import { getLinuxTimestampBefore24Hours } from '@Views/DashboardV2/utils/getLinuxTimestampBefore24Hours';
import { appConfig } from '@Views/TradePage/config';
import axios from 'axios';
import { getAddress } from 'ethers/lib/utils.js';
import { useMemo } from 'react';
import useSWR from 'swr';

export const useOneDayVolume = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const graphqlURL = config.graph.MAIN;
  const { data } = useSWR('above-below-one-day-volume', {
    fetcher: async () => {
      const response = await axios.post(graphqlURL, {
        query: `{ 
              volumePerContracts(   
                orderBy: "timestamp"
                orderDirection: "desc"
                first: 1000
                where: { timestamp_gt: "${getLinuxTimestampBefore24Hours()}"}) {
                optionContract {
                  address
                }
                amount
              }
            }`,
      });
      return response.data?.data as {
        volumePerContracts: {
          optionContract: {
            address: string;
            poolContract: string;
          };
          amount: string;
        }[];
      };
    },
    refreshInterval: 300,
  });

  const oneDayVolume = useMemo(() => {
    if (!data || !data.volumePerContracts) return {};
    const startObject: { [key: string]: string } = {};
    return data.volumePerContracts.reduce((acc, item) => {
      const address = getAddress(item.optionContract.address);
      if (acc[address]) {
        acc[address] = add(acc[address], item.amount);
      } else {
        acc[address] = item.amount;
      }
      return acc;
    }, startObject);
  }, [data]);

  return { oneDayVolume };
};
