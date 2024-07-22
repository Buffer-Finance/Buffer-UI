import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import useSWR from 'swr';
import { Chain } from 'viem';
import { tokensPerInterval } from '../types';

export const useTokensPerInterval = (activeChain: Chain) => {
  const graphUrl = 'http://ponder.buffer.finance/';
  return useSWR<tokensPerInterval>(`${activeChain}-tokens-per-interval`, {
    fetcher: async () => {
      const query = `{
        usdcPerInterval:rewardsPerIntervals(
            where: {id: "USDC"}
        ) {
           items{
            amount
           }
          }
        lockPerInterval:rewardsPerIntervals(
            where: {id: "lock"}
        ) {
            items{
              amount
            }
          }
        lockMultiplierSettings{
          items{
            maxLockDuration
          minLockDuration
          maxLockMultiplier
          }
        }
      }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          const returnResponse = {
            usdcPerInterval: data.data.usdcPerInterval.items,
            lockPerInterval: data.data.lockPerInterval.items,
            lockMultiplierSettings: data.data.lockMultiplierSettings.items,
          };
          return returnResponse;
        } else {
          throw new Error('Failed to fetch tokens per interval');
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
};
