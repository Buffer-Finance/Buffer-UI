import axios from 'axios';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { getAddress } from 'viem';
import { nolossmarketsAtom, userAtom } from '../atoms';
import { marketsForChart } from '../config';
import { BetState, TradeInputs, useAheadTrades } from './useAheadTrades';
import { usePastTradeQueryByFetch } from './usePastTradeQueryByFetch';
export const expiryPriceCache: {
  [key: string]: string;
} = {};

export const tardesAtom = atom<{
  active: (IGQLHistory | null)[];
  history: IGQLHistory[];
  cancelled: IGQLHistory[];
}>({
  active: [],
  history: [],
  cancelled: [],
});
export const tardesPageAtom = atom<{
  active: number;
  history: number;
  cancelled: number;
}>({
  active: 1,
  history: 1,
  cancelled: 1,
});
export const tardesTotalPageAtom = atom<{
  active: number;
  history: number;
  cancelled: number;
}>({
  active: 1,
  history: 1,
  cancelled: 1,
});
export const updateTotalPageNumber = atom(
  null,
  (
    get,
    set,
    update: {
      active: number;
      history: number;
      cancelled: number;
    }
  ) => {
    set(tardesTotalPageAtom, update);
  }
);
export const updateActivePageNumber = atom(null, (get, set, update: number) => {
  set(tardesPageAtom, { ...get(tardesPageAtom), active: update });
});
export const updateHistoryPageNumber = atom(
  null,
  (get, set, update: number) => {
    set(tardesPageAtom, { ...get(tardesPageAtom), history: update });
  }
);
export const updateCancelledPageNumber = atom(
  null,
  (get, set, update: number) => {
    set(tardesPageAtom, { ...get(tardesPageAtom), cancelled: update });
  }
);

// {
//   1: 'active'
//   2: 'exercised'
//   3: 'expired'
//   4: 'queued',
//   5:cancelled
// }

const TRADESINAPAGE = 10;
export interface IGQLHistory {
  strike: string;
  totalFee: string;
  state: BetState;
  isAbove: boolean;
  optionContract: {
    asset: string;
    address: string;
  };
  amount?: string;
  creationTime?: string;

  expirationPrice?: string;
  expirationTime?: string;
  payout?: string;
  queueID?: string;
  optionID?: string;
  reason?: string;
  user: {
    address: string;
  };
  queueTimestamp?: string;
  cancelTimestamp?: string;
  slippage?: string;
  //added on FE
  blockNumber?: number;
  chartData: (typeof marketsForChart)[keyof typeof marketsForChart];
}

export const useProcessedTrades = () => {
  const markets = useAtomValue(nolossmarketsAtom);
  const getProcessedTrades = useCallback(
    (
      trades: (IGQLHistory | null)[] | undefined,
      block: number,
      tradesToBeDeleted?: TradeInputs[],
      shouldAddHistoryPrice = false
    ) => {
      const tempTrades = trades?.map((singleTrade: IGQLHistory | null) => {
        if (singleTrade === null) {
          return null;
        }
        // console.log(singleTrade, 'singleTrade');
        if (singleTrade.blockNumber) {
          if (block >= singleTrade.blockNumber) {
            // if graph scanned this block.
            return null;
          }
        }
        if (tradesToBeDeleted?.length) {
          if (
            tradesToBeDeleted.find(
              (singleRawTrade) =>
                singleTrade.queueID &&
                singleRawTrade.id == +singleTrade.queueID &&
                singleTrade.state === BetState.queued
            )
          ) {
            return null;
          }
        }

        if (shouldAddHistoryPrice) {
          addExpiryPrice(singleTrade);
        }

        return singleTrade;
      });

      const updatedTrade = tempTrades
        ?.map((trade) => {
          if (trade === null) return null;
          if (!markets) return null;

          const market = markets.find(
            (market) =>
              getAddress(market.address) ===
              getAddress(trade.optionContract.address)
          );
          if (!market) return null;
          return {
            ...trade,
            chartData: market.chartData,
          };
        })
        .filter((trade) => trade !== null);

      return updatedTrade;
    },
    [markets]
  );

  return { getProcessedTrades };
};

export const addExpiryPrice = async (currentTrade: IGQLHistory) => {
  if (currentTrade.state === BetState.active) {
    const assets = currentTrade.optionContract.asset;
    axios
      .post(`https://oracle.buffer-finance-api.link/price/query/`, [
        {
          pair: assets,
          timestamp: currentTrade.expirationTime,
        },
      ])
      .then((response) => {
        console.log(`response[fetch]: `, response);
        if (currentTrade.optionID !== undefined) {
          if (
            !expiryPriceCache[currentTrade.optionID] &&
            response?.data?.[0]?.price
          )
            expiryPriceCache[currentTrade.optionID] =
              response?.data?.[0].price.toString();
        }
      });
  }
};

export const usePastTradeQuery = () => {
  //   const { address: account } = useUserAccount();
  const user = useAtomValue(userAtom);
  const { getProcessedTrades } = useProcessedTrades();
  const setTrades = useSetAtom(tardesAtom);
  const setPageNumbers = useSetAtom(updateTotalPageNumber);
  const { active, history, cancelled } = useAtomValue(tardesPageAtom);
  const activePage = useMemo(() => TRADESINAPAGE * (active - 1), [active]);
  const historyPage = useMemo(() => TRADESINAPAGE * (history - 1), [history]);
  const cancelledPage = useMemo(
    () => TRADESINAPAGE * (cancelled - 1),
    [cancelled]
  );

  const { data } = usePastTradeQueryByFetch({
    account: user?.userAddress,
    historyskip: historyPage,
    historyfirst: TRADESINAPAGE,
    activeskip: activePage,
    activefirst: TRADESINAPAGE,
    cancelledskip: cancelledPage,
    cancelledfirst: TRADESINAPAGE,
    currentTime: Math.floor(new Date().getTime() / 1000),
  });

  const blockNumber = data?._meta?.block.number;
  const trades = useAheadTrades(blockNumber, user?.userAddress, false);
  // console.log(`trades: `, trades);
  //  { data: [], del: [], fromBlock: 0, toBlock: null };
  useEffect(() => {
    let activeResponseArr: (IGQLHistory | null)[] = [];
    if (trades?.[BetState.queued] || trades?.[BetState.active])
      activeResponseArr = [
        ...trades[BetState.queued],
        ...trades[BetState.active],
      ];
    if (data?.queuedTrades) {
      activeResponseArr = [...activeResponseArr, ...data?.queuedTrades];
    }
    if (data?.activeTrades) {
      activeResponseArr = [...activeResponseArr, ...data.activeTrades];
    }

    activeResponseArr = getProcessedTrades(
      activeResponseArr,
      blockNumber,
      trades?.['del'] || []
    );

    let historyResponseArr = data?.historyTrades;
    let cancelledResponseArr = data?.cancelledTrades;
    cancelledResponseArr = getProcessedTrades(
      cancelledResponseArr,
      blockNumber
    );

    if (historyResponseArr?.length) {
      historyResponseArr = [...data?.historyTrades];
    }
    historyResponseArr = getProcessedTrades(
      historyResponseArr,
      blockNumber,
      undefined,
      true
    );

    setTrades({
      active: activeResponseArr,
      history: historyResponseArr,
      cancelled: cancelledResponseArr,
    });
    if (data?.activeLength)
      setPageNumbers({
        active: Math.ceil(data.activeLength.length / TRADESINAPAGE),
        history: Math.ceil(data.historyLength.length / TRADESINAPAGE),
        cancelled: Math.ceil(data.cancelledLength.length / TRADESINAPAGE),
      });
    else
      setPageNumbers({
        active: 0,
        history: 0,
        cancelled: 0,
      });
  }, [
    data?.historyTrades,
    data?.activeTrades,
    data?.queuedTrades,
    data?.cancelledTrades,
    data?._meta,
    data?.activeLength,
    data?.historyLength,
    data?.cancelledLength,
    user?.userAddress,
    trades?.[BetState.active],
    trades?.[BetState.queued],
    // loading,
    trades,
  ]);
};
