import axios from 'axios';
import useSWR from 'swr';
import { useActiveChain } from './useActiveChain';
import { refreshInterval } from '@Views/TradePage/config';
import { getConfig } from '@Views/TradePage/utils/getConfig';

import { getConfig as ABGetConfig } from '@Views/ABTradePage/utils/getConfig';
const emptyArr = [];
const usePlatformEvent = () => {
  // const { activeChain } = useActiveChain();
  // const configData = getConfig(activeChain.id);
  // return useSWR('delow-ab', {
  //   fetcher: async () => {
  //     const response = await axios.post(configData.graph.EVENTS, {
  //       query: `{
  //           platformEvents(first:50, orderBy:updatedAt, orderDirection:desc) {
  //             user
  //             id
  //             isAbove
  //             updatedAt
  //             expirationTime
  //             strike
  //             optionContract {
  //               pool
  //             }
  //             amount
  //             totalFee
  //             payout
  //             event
  //           }
  //         }`,
  //     });
  //     // console.log(`response.data?.data: `, response.data?.data);
  //     // console.log(`thegraphresponse.data: `, response.data);
  //     console.log(`usePlatformEvent-response.data: `, response.data);
  //     return response.data?.data?.platformEvents || emptyArr;
  //   },
  //   refreshInterval: 1000,
  // });
  return { data: emptyArr };
};
const usePlatformEventAB = () => {
  // const { activeChain } = useActiveChain();
  // const configData = ABGetConfig(activeChain.id);

  // return useSWR('delow-ab-v2', {
  //   fetcher: async () => {
  //     const response = await axios.post(configData.graph.EVENTS, {
  //       query: `{
  //           platformEvents(first:50, orderBy:updatedAt, orderDirection:desc) {
  //             user
  //             id
  //             isAbove
  //             updatedAt
  //             expirationTime
  //             strike
  //             optionContract {
  //               pool
  //             }
  //             amount
  //             totalFee
  //             payout
  //             event
  //           }
  //         }`,
  //     });
  //     // console.log(`response.data?.data: `, response.data?.data);
  //     // console.log(`thegraphresponse.data: `, response.data);
  //     console.log(`usePlatformEvent-response.data: `, response.data);
  //     return response.data?.data?.platformEvents || emptyArr;
  //   },
  //   refreshInterval: 1000,
  // });
  return { data: emptyArr };
};

export { usePlatformEvent, usePlatformEventAB };
