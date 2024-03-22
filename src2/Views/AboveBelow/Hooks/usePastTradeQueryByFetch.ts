import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
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
  account: string | undefined;
  historyskip: number;
  historyfirst: number;
  activeskip: number;
  activefirst: number;
  cancelledskip: number;
  cancelledfirst: number;
  currentTime: number;
}) => {
  const { activeChain } = useActiveChain();

  return useSWR(
    `history-thegraph-activePage-${activeskip}-historyPage${historyskip}-cancelledPage-${cancelledskip}-account-${account}-activeChain-${activeChain?.id}-above-below`,
    {
      fetcher: async () => {
        // console.log(
        //   activeChain?.id,
        //   account,
        //   activeTournamentId,
        //   'trades-fetch'
        // );
        if (activeChain === undefined) return;
        if (account === undefined) return;
        const config = getConfig(activeChain?.id);
        const response = await axios.post(config.graph.ABOVE_BELOW, {
          query: `{ 
            historyTrades: userOptionDatas(
              orderBy: expirationTime
              orderDirection: desc
              first: ${historyfirst}
              skip: ${historyskip}
              where: {
                user: "${account}",
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime}
              }
            ){
                amount
                creationTime
                expirationPrice
                expirationTime
                isAbove
                payout
                queueID
                optionID
                state
                strike
                totalFee
                user
                optionContract {
                  token0
                  token1
                  address
                }
            }
             activeTrades: userOptionDatas(
              orderBy: creationTime
              orderDirection: desc
              first: ${activefirst}
              skip: ${activeskip}
              where: {
                user: "${account}",
                state_in: [1],
                expirationTime_gt: ${currentTime}
              }
            ){
                amount
                creationTime
                expirationPrice
                expirationTime
                isAbove
                payout
                queueID
                optionID
                state
                strike
                totalFee
                user
                optionContract {
                  token0
                  token1
                  address
                }
            }
             queuedTrades: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                user: "${account}",
                state_in: [4],
              }
            ){
                isAbove
                queueID
                state
                strike
                user
                queueTimestamp
                totalFee
                maxFeePerContract
                expirationTime
                numberOfContracts
                optionContract {
                  token0
                  token1
                  address
                }
            }
             cancelledTrades: queuedOptionDatas(
              first: ${cancelledfirst}
              skip: ${cancelledskip}
              orderBy: queueID
              orderDirection: desc
              where: {
                user: "${account}",
                state_in: [5],
              }
            ){
                isAbove
                queueID
                reason
                state
                strike
                queueTimestamp
                totalFee
                cancelTimestamp
                maxFeePerContract
                expirationTime
                numberOfContracts
                user
                optionContract {
                  token0
                  token1
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
              first: 10000
              where: {
                user: "${account}",
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime}
              }
            ){
                
                id
                
            }
             activeLength: userOptionDatas(
              orderBy: creationTime
              orderDirection: desc
              where: {
                user: "${account}",
                state_in: [1],
                expirationTime_gt: ${currentTime}
              }
            ){
                
                id
                
            }

             cancelledLength: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                user: "${account}",
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
