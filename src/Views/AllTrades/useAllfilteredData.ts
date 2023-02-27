import { useAheadTrades } from '@Hooks/useAheadTrades';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getProcessedTrades } from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { allATrdesTotalPageAtom } from '.';
import { useAllTradesGraphQl } from './useAllTradesGraphQl';

const TRADESINAPAGE = 10;

export const useAllfilteredData = () => {
  const { active, history, cancelled } = useAtomValue(allATrdesTotalPageAtom);
  const activeSkip = useMemo(() => TRADESINAPAGE * (active - 1), [active]);
  const historySkip = useMemo(() => TRADESINAPAGE * (history - 1), [history]);
  const { address } = useUserAccount();
  const { data } = useAllTradesGraphQl({
    activefirst: TRADESINAPAGE,
    activeskip: activeSkip,
    currentTime: Math.floor(new Date().getTime() / 1000),
    historyfirst: TRADESINAPAGE,
    historyskip: historySkip,
  });
  const { data: augmentedTrades } = useAheadTrades(
    data?._meta.block.number,
    address,
    true
  );
  console.log(augmentedTrades, 'augmentedTrades');

  return {
    activeTrades: useMemo(() => {
      if (data && data.activeTrades && data.queuedTrades)
        return getProcessedTrades(
          [...data.queuedTrades, ...data.activeTrades],
          data?._meta.block.number
        );
      return null;
    }, [data?.activeTrades, data?.queuedTrades]),
    historyTrades: useMemo(
      () => getProcessedTrades(data?.historyTrades, data?._meta.block.number),
      [data?.historyTrades]
    ),
  };
};
