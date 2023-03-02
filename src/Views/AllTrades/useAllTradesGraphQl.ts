import axios from 'axios';
import { baseGraphqlLiteUrl } from 'config';
import useSWR from 'swr';

type tradeType = {
  amount: string;
  creationTime: string;
  depositToken: string;
  expirationPrice: string;
  expirationTime: string;
  isAbove: string;
  payout: string;
  queueID: string;
  optionID: string;
  state: string;
  strike: string;
  totalFee: string;
  user: {
    address: string;
  };
  optionContract: {
    address: string;
  };
};

interface Iresponse {
  historyTrades: tradeType[];
  activeTrades: tradeType[];
  queuedTrades: tradeType[];
  cancelledTrades: tradeType[];
  _meta: {
    block: {
      number: string;
    };
  };
}

export const useAllTradesGraphQl = ({
  historyskip,
  historyfirst,
  activeskip,
  activefirst,
  currentTime,
  cancelledfirst,
  cancelledskip,
}: {
  // account: string;
  historyskip: number;
  historyfirst: number;
  activeskip: number;
  activefirst: number;
  currentTime: number;
  cancelledfirst: number;
  cancelledskip: number;
}) => {
  return useSWR<Iresponse>(
    `all-trades-thegraph-activePage-${activeskip}-historyPage${historyskip}-cancelledskip-${cancelledskip}`,
    {
      fetcher: async () => {
        const response = await axios.post(baseGraphqlLiteUrl.testnet, {
          query: `{ 
            historyTrades: userOptionDatas(
              orderBy: expirationTime
              orderDirection: desc
              first: ${historyfirst}
              skip: ${historyskip}
              where: {
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime}
              }
            ){
                amount
                creationTime
                depositToken
                expirationPrice
                expirationTime
                isAbove
                payout
                queueID
                optionID
                state
                strike
                totalFee
                user {
                  address
                }
                optionContract {
                  address
                }
            }
             activeTrades: userOptionDatas(
              orderBy: creationTime
              orderDirection: desc
              first: ${activefirst}
              skip: ${activeskip}
              where: {
                state_in: [1],
                expirationTime_gt: ${currentTime}
              }
            ){
                amount
                creationTime
                depositToken
                expirationPrice
                expirationTime
                isAbove
                payout
                queueID
                optionID
                state
                strike
                totalFee
                user {
                  address
                }
                optionContract {
                  address
                }
            }
             queuedTrades: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                state_in: [4],
              }
            ){
                depositToken
                isAbove
                queueID
                state
                slippage
                strike
                totalFee
                user {
                  address
                }
                optionContract {
                  address
                }
            }
            cancelledTrades: queuedOptionDatas(
              first: ${cancelledfirst}
              skip: ${cancelledskip}
              orderBy: queueID
              orderDirection: desc
              where: {
                state_in: [5],
              }
            ){
                depositToken
                isAbove
                queueID
                reason
                state
                slippage
                strike
                totalFee
                queueTimestamp
                cancelTimestamp
                user {
                  address
                }
                optionContract {
                  asset
                  address
                }
            }
            _meta {
              block {
                number
              }
            }
          }`,
        });
        return response.data?.data;
      },
      refreshInterval: 300,
    }
  );
};
