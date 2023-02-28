import { BetState, useAheadTrades } from '@Hooks/useAheadTrades';
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
  const { data } = useAllTradesGraphQl({
    activefirst: 1000,
    activeskip: activeSkip,
    currentTime: Math.floor(new Date().getTime() / 1000),
    historyfirst: TRADESINAPAGE,
    historyskip: historySkip,
  });
  const { data: augmentedTrades } = useAheadTrades(
    data?._meta.block.number,
    null,
    true
  );
  console.log(augmentedTrades, 'augmentedTrades');

  const activeTrades = useMemo(() => {
    let trades = [];
    if (augmentedTrades !== -1 && augmentedTrades !== undefined)
      trades = [
        ...augmentedTrades[BetState.queued],
        ...augmentedTrades[BetState.active],
        ...trades,
      ];
    if (data && data.activeTrades && data.queuedTrades) {
      trades = [...trades, ...data.queuedTrades];
    }
    if (data && data.activeTrades) {
      trades = [...trades, ...data.activeTrades];
    }

    return getProcessedTrades(
      trades,
      data?._meta.block.number,
      trades?.['del'] || []
    ).filter((trade) => !!trade);
  }, [data?.activeTrades, data?.queuedTrades, augmentedTrades]);

  const historyTrades = useMemo(() => {
    if (data && data.historyTrades) {
      let trades = [...data.historyTrades];

      if (augmentedTrades !== -1 && augmentedTrades !== undefined)
        trades = [...trades];
      return getProcessedTrades(
        data?.historyTrades,
        data?._meta.block.number,
        null,
        true
      ).filter((trade) => !!trade);
    }
  }, [data?.historyTrades, augmentedTrades]);

  return {
    activeTrades,
    historyTrades,
  };
};
