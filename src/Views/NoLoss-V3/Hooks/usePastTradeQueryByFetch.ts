import axios from 'axios';
import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { activeChainAtom, activeTournamentIdAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

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
  const activeChain = useAtomValue(activeChainAtom);
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);

  return useSWR(
    `history-thegraph-activePage-${activeskip}-historyPage${historyskip}-cancelledPage-${cancelledskip}-account-${account}-activeChain-${activeChain?.id}-tournamentId-${activeTournamentId}`,
    {
      fetcher: async () => {
        // console.log(
        //   activeChain?.id,
        //   account,
        //   activeTournamentId,
        //   'trades-fetch'
        // );
        if (activeChain === undefined) return;
        if (activeTournamentId === undefined) return;
        if (account === undefined) return;
        const config = getNoLossV3Config(activeChain?.id);
        const response = await axios.post(config.graph, {
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
                tournament: "${activeTournamentId}"
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
                user: "${account}",
                state_in: [1],
                expirationTime_gt: ${currentTime}
                tournament: "${activeTournamentId}"
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
                  asset
                  address
                }
            }
             queuedTrades: queuedOptionDatas(
              orderBy: queueID
              orderDirection: desc
              where: {
                user: "${account}",
                state_in: [4],
                tournament: "${activeTournamentId}"
              }
            ){
                isAbove
                queueID
                state
                slippage
                strike
                totalFee
                user
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
                user: "${account}",
                state_in: [5],
                tournament: "${activeTournamentId}"
              }
            ){
                isAbove
                queueID
                reason
                state
                slippage
                strike
                totalFee
                queueTimestamp
                cancelTimestamp
                user
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
              first: 10000
              where: {
                user: "${account}",
                state_in: [1,2,3],
                expirationTime_lt: ${currentTime}
                tournament: "${activeTournamentId}"
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
                tournament: "${activeTournamentId}"
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
                tournament: "${activeTournamentId}"
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
