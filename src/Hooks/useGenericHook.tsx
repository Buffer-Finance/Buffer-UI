import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useToast } from '@Contexts/Toast';
import {
  SetShareBetAtom,
  SetShareStateAtom,
} from '@Views/BinaryOptions/Components/shareModal';
import {
  IGQLHistory,
  tardesAtom,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { getExpireNotification } from '@Views/BinaryOptions/Tables/TableComponents';
import { BetState } from '@Hooks/useAheadTrades';

export const getIdentifier = (a: IGQLHistory) => {
  return +a.queueID;
};

const useGenericHooks = () => {
  const { active: binaryData } = useAtomValue(tardesAtom);
  const tradeCache = useRef<{
    [tradeId: string]: { trade: IGQLHistory; visited: boolean };
  }>({});
  // const binaryData = [];
  const toastify = useToast();
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);

  const openShareModal = (trade: IGQLHistory, expiry: string) => {
    setIsOpen(true);
    setBet({ trade, expiryPrice: expiry });
  };

  useEffect(() => {
    const delay = 2;
    if (!binaryData) return;
    if (typeof binaryData.forEach !== 'function') return;
    // make all new true
    for (let trade of binaryData) {
      if (trade.state == BetState.active) {
        let tradeIdentifier = getIdentifier(trade);
        tradeCache.current[tradeIdentifier] = { trade, visited: true };
      }
    }

    for (let tradeIdentifier in tradeCache.current) {
      const currTrade = tradeCache.current[tradeIdentifier];
      // one which is not getting true, i.e not in newer set of activeTrades i.e got expired
      if (!currTrade.visited) {
        console.log(`[win-state]useGenericHook-currTrade: `, currTrade);
        setTimeout(() => {
          getExpireNotification(
            { ...currTrade.trade },
            toastify,
            openShareModal
          );
        }, delay * 1000);
        delete tradeCache.current[tradeIdentifier];
      }
    }

    return () => {
      // make all prev false
      for (let tradeIdentifier in tradeCache.current) {
        tradeCache.current[tradeIdentifier] = {
          ...tradeCache.current[tradeIdentifier],
          visited: false,
        };
      }
    };
    // if some trade left with visited:false - that trade is the one for which we want to show notif
  }, [binaryData]);
};

export { useGenericHooks };
