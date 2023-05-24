import { useActiveChain } from '@Hooks/useActiveChain';
import { useNoLossStaticConfig } from '@Views/NoLoss/useNoLossConfig';
import axios from 'axios';
import useSWR from 'swr';

export const usePastTradeQueryByFetch = ({
  account,
  historyskip,
  historyfirst,
  activeskip,
  activefirst,
  cancelledskip,
  cancelledfirst,
  currentTime,
}: {
  account: string;
  historyskip: number;
  historyfirst: number;
  activeskip: number;
  activefirst: number;
  cancelledskip: number;
  cancelledfirst: number;
  currentTime: number;
}) => {
  const { configContracts } = useActiveChain();
  const config = useNoLossStaticConfig();
  return useSWR(
    `history-thegraph-activePage-${activeskip}-historyPage${historyskip}-cancelledPage-${cancelledskip}-account-${account}`,
    {
      fetcher: async () => {
        const response = await axios.post(configContracts.graph.LITE, {
          query: `{ 
            historyTrades: userOptionDatas(
              orderBy: expirationTime
              orderDirection: desc
              first: ${historyfirst}
              skip: ${historyskip}
              where: {
                user_: {address: "${account}"},
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
                  asset
                  address
                }
            }
             activeTrades: userOptionDatas(
              orderBy: creationTime
              orderDirection: desc
              first: ${activefirst}
              skip: ${activeskip}
              where: {
                user_: {address: "${account}"},
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
                  asset
                  address
                }
            }
             queuedTrades: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
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
                  asset
                  address
                }
            }
             cancelledTrades: queuedOptionDatas(
              first: ${cancelledfirst}
              skip: ${cancelledskip}
              orderBy: queueID
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
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
            
            historyLength: userOptionDatas(
              orderBy: expirationTime
              orderDirection: desc
              first: 1000
              where: {
                user_: {address: "${account}"},
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime}
              }
            ){
                
                id
                
            }
            lastActive: userOptionDatas(
              orderBy: creationTime
              first: 1
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
                state_in: [1],
                expirationTime_lt: ${currentTime},
              }
            ){
              queueID
            }
            lastExpired: userOptionDatas(
              orderBy: queueID
              first: 1
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime},
              }
            ){
              queueID
            }
            activeLength: userOptionDatas(
              orderBy: creationTime
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
                state_in: [1],
                expirationTime_gt: ${currentTime}
              }
            ){
                
              queueID
                
            }

             cancelledLength: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                user_: {address: "${account}"},
                state_in: [5],
              }
            ){
                id
            }
            
          }`,
        });
        return response.data?.data;
      },
      refreshInterval: 300,
    }
  );
};
