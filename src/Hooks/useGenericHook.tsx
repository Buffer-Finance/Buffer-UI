import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useToast } from '@Contexts/Toast';
import { TradeType, marketType, poolInfoType } from '@Views/TradePage/type';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';

import { getExpireNotification } from '@Views/TradePage/utils/getExpireNotification';
import {
  SetShareBetAtom,
  SetShareStateAtom,
  shareSettingsAtom,
} from '@Views/TradePage/atoms';

export const getIdentifier = (a: TradeType) => {
  return +a.queue_id;
};

const useGenericHooks = () => {
  const [activeTrades] = useOngoingTrades();
  const markets = useMarketsConfig();

  const tradeCache = useRef<{
    [tradeId: string]: { trade: TradeType; visited: boolean };
  }>({});
  // const binaryData = [];
  const toastify = useToast();
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);
  const { showSharePopup } = useAtomValue(shareSettingsAtom);
  const { getPoolInfo } = usePoolInfo();
  const openShareModal = (
    trade: TradeType,
    expiry: string,
    market: marketType,
    poolInfo: poolInfoType
  ) => {
    if (!showSharePopup) return;
    setIsOpen(true);
    console.log(
      `TableComponents-, market, poolInfo: `,
      trade,
      expiry,
      market,
      poolInfo
    );
    setBet({ trade, expiryPrice: expiry, market, poolInfo });
  };

  useEffect(() => {
    // make all trade as not visited.
    // whenever trades arr changed check all trades & mark them true.
    // trades which remains false even after checking are the trades which are expired.
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
        const poolContract = tradeMarket?.pools.find(
          (pool) =>
            pool.optionContract.toLowerCase() ===
            currTrade.trade?.target_contract.toLowerCase()
        )?.pool;
        const poolInfo = getPoolInfo(poolContract);
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
            toastify,
            openShareModal,
            poolInfo,
            showSharePopup
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
