import { useActiveChain } from '@Hooks/useActiveChain';
import { useProcessedTrades } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/ABTradePage/Views/AccordionTable/Common';
import { getConfig } from '@Views/ABTradePage/utils/getConfig';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Active } from '../Tables/Active';
import { activeActivePageAtom } from './atoms';

export const AllActive: React.FC<{
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
}> = ({ onlyView, overflow, isMobile }) => {
  const [activePage, setActivePage] = useAtom(activeActivePageAtom);
  const { activeChain } = useActiveChain();
  const { getProcessedTrades } = useProcessedTrades();

  const { data: totalActive } = useSWR(`total-active`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post('AB-PONDER', {
        query: `{
            activeLength: userOptionDatas(
                orderBy: creationTime
                orderDirection: desc
                first: 10000
                where: {
                  state_in: [1],
                  expirationTime_gt: ${Math.floor(Date.now() / 1000)}
                }
              ){  
                  id
              }
            }`,
      });
      return response.data?.data.activeLength;
    },
  });

  const { data } = useSWR(`all-active-${activePage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post('AB-PONDER', {
        query: `{
            activeTrades: userOptionDatas(
                orderBy: creationTime
                orderDirection: desc
                first: ${10}
                skip: ${(activePage - 1) * 10}
                where: {
                  state_in: [1],
                  expirationTime_gt: ${Math.floor(Date.now() / 1000)}
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
      return response.data?.data.activeTrades;
    },
    refreshInterval: 1000,
  });

  const activeTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);

  return (
    <Active
      onlyView={onlyView}
      overflow={overflow}
      isMobile={isMobile}
      activePage={activePage}
      setActivePage={setActivePage}
      totalPages={totalActive ? Math.ceil(totalActive.length / 10) : 1}
      isLoading={false}
      active={activeTrades ?? []}
      inGlobalContext
      error={<TableErrorRow msg={'No Active Trades Found.'} />}
    />
  );
};
