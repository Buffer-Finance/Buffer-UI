import { useActiveChain } from '@Hooks/useActiveChain';
import { useProcessedTrades } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { History } from '../Tables/History';
import { historyActivePageAtom } from './atoms';

export const AllHistory: React.FC<{
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
}> = ({ onlyView, overflow, isMobile }) => {
  const [activePage, setActivePage] = useAtom(historyActivePageAtom);
  const { activeChain } = useActiveChain();
  const { getProcessedTrades } = useProcessedTrades();

  const { data: totalHistory } = useSWR(`total-history`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(config.graph.MAIN, {
        query: `{
            historyLength: userOptionDatas(
                orderBy: expirationTime
                orderDirection: desc
                first: 10000
                where: {
                  state_in: [1,2,3],
                  expirationTime_lt: ${Math.floor(Date.now() / 1000)}
                }
              ){ 
                  id
              }
        }`,
      });
      return response.data?.data.historyLength;
    },
  });

  const { data } = useSWR(`all-history-${activePage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(config.graph.MAIN, {
        query: `{
                historyTrades: userOptionDatas(
                    orderBy: expirationTime
                    orderDirection: desc
                    first: ${10}
                    skip: ${(activePage - 1) * 10}
                    where: {
                      state_in: [1,2,3],
                      expirationTime_lt: ${Math.floor(Date.now() / 1000)}
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
            }`,
      });
      return response.data?.data.historyTrades;
    },
    refreshInterval: 1000,
  });
  // console.log(data);

  const historyTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);
  console.log(data);
  return (
    <History
      onlyView={onlyView}
      overflow={overflow}
      isMobile={isMobile}
      activePage={activePage}
      setHistoryPage={setActivePage}
      totalPages={totalHistory ? Math.ceil(totalHistory.length / 10) : 1}
      isLoading={false}
      history={historyTrades ?? []}
      inGlobalContext
      error={<TableErrorRow msg={'No Trades Found.'} />}
    />
  );
};
