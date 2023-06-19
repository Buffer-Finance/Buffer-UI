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
import { OngoingTradeSchema } from '@Views/TradePage/type';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';

export const getIdentifier = (a: IGQLHistory) => {
  return +a.queueID;
};

const useGenericHooks = () => {
  const [activeTrades] = useOngoingTrades();
  const markets = useMarketsConfig();

  const tradeCache = useRef<{
    [tradeId: string]: { trade: OngoingTradeSchema; visited: boolean };
  }>({});
  // const binaryData = [];
  const toastify = useToast();
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);

  const openShareModal = (trade: OngoingTradeSchema, expiry: string) => {
    setIsOpen(true);
    setBet({ trade, expiryPrice: expiry });
  };

  useEffect(() => {
    const delay = 2;
    if (!activeTrades) return;
    if (typeof activeTrades.forEach !== 'function') return;
    // make all new true
    for (let trade of activeTrades) {
      if (trade.state == 'OPENED') {
        let tradeIdentifier = trade.queue_id;
        tradeCache.current[tradeIdentifier] = { trade, visited: true };
      }
    }

    for (let tradeIdentifier in tradeCache.current) {
      const currTrade = tradeCache.current[tradeIdentifier];
      // one which is not getting true, i.e not in newer set of activeTrades i.e got expired
      if (!currTrade.visited) {
        const tradeMarket = markets?.find((pair) => {
          const pool = pair.pools.find(
            (pool) =>
              pool.optionContract.toLowerCase() ===
              currTrade.trade?.target_contract.toLowerCase()
          );
          return !!pool;
        });
        if (!tradeMarket) {
          toastify({
            msg: 'some wrong config passed in history',
            type: 'error',
            id: 'ddxcadf',
          });
        }
        setTimeout(() => {
          getExpireNotification(
            { ...currTrade.trade },
            tradeMarket!,
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
  }, [activeTrades]);
};

export { useGenericHooks };
