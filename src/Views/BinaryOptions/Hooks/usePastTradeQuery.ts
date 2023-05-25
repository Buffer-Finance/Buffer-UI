import { IMarket, IToken } from '..';
import { BetState, TradeInputs, useAheadTrades } from '@Hooks/useAheadTrades';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { usePastTradeQueryByFetch } from './usePastTradeQueryByFetch';
import axios from 'axios';
import { expiryPriceCache } from './useTradeHistory';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useActiveChain } from '@Hooks/useActiveChain';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { useAugmentedTrades } from './useAugmentedTrades';
import { V3AppConfig, useV3AppConfig } from '@Views/V3App/useV3AppConfig';
import { marketsForChart, v3AppConfig } from '@Views/V3App/config';
import { valueof } from 'react-joyride';
import { joinStrings } from '@Views/V3App/helperFns';

export const tardesAtom = atom<{
  active: IGQLHistory[];
  history: IGQLHistory[];
  cancelled: IGQLHistory[];
}>({
  active: null,
  history: null,
  cancelled: null,
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
export const updateTotalPageNumber = atom(null, (get, set, update) => {
  set(tardesTotalPageAtom, update);
});
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
  slippage?: string;
  //added on FE
  configPair?: V3AppConfig;
  blockNumber?: number;
  chartData: typeof marketsForChart.ARBUSD;
  poolInfo: {
    tokenAddress: string;
    meta: string;
    decimals: number;
    token: string;
    is_pol: boolean;
  };
}

export const useProcessedTrades = () => {
  const { activeChain } = useActiveChain();
  const configData =
    v3AppConfig[activeChain.id as unknown as keyof typeof v3AppConfig];
  const v3Config = useV3AppConfig();
  const getProcessedTrades = (
    trades,
    block,
    tradesToBeDeleted?: TradeInputs[],
    shouldAddHistoryPrice = false
  ) => {
    const tempTrades = trades?.map((singleTrade: IGQLHistory) => {
      if (v3Config === null) return;
      let pool;
      const configPair = v3Config.find((pair) => {
        pool = pair.pools.find(
          (pool) =>
            pool.optionContract.toLocaleLowerCase() ===
            singleTrade.optionContract.address.toLowerCase()
        );
        return !!pool;
      });
      if (!pool) return null;

      const poolInfo = configData.poolsInfo[pool.pool];
      const marketId = joinStrings(configPair?.token0, configPair?.token1, '');
      const chartData =
        marketsForChart[marketId as keyof typeof marketsForChart];
      let updatedTrade = { ...singleTrade, configPair, chartData, poolInfo };
      if (shouldAddHistoryPrice) {
        if (singleTrade.expirationTime < Date.now() / 1000)
          // console.log(
          //   `singleTrade.expirationTime: `,
          //   singleTrade.expirationTime
          // );
          addExpiryPrice(updatedTrade);
      }

      return updatedTrade;
    });
    // filter out not-null bets.
    tempTrades?.filter((t) => {
      if (t) {
        return true;
      }
      return false;
    });

    return tempTrades;
  };
  return { getProcessedTrades };
};

export const addExpiryPrice = async (currentTrade: IGQLHistory) => {
  if (
    currentTrade.state === BetState.active &&
    !expiryPriceCache?.[currentTrade.optionID]
  ) {
    // console.log(`[augexp]currentTrade: `, currentTrade);
    axios
      .post(`https://oracle.buffer-finance-api.link/price/query/`, [
        {
          pair: currentTrade.configPair.tv_id,
          timestamp: currentTrade.expirationTime,
        },
      ])
      .then((response) => {
        if (
          !expiryPriceCache[currentTrade.optionID] &&
          response?.data?.[0]?.price
        )
          expiryPriceCache[currentTrade.optionID] =
            response?.data?.[0].price.toString();
      });
  }
};

export const usePastTradeQuery = () => {
  const { address: account } = useUserAccount();
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

  const { data: remoteData } = usePastTradeQueryByFetch({
    account: account,
    historyskip: historyPage,
    historyfirst: TRADESINAPAGE,
    activeskip: activePage,
    activefirst: TRADESINAPAGE,
    cancelledskip: cancelledPage,
    cancelledfirst: TRADESINAPAGE,
    currentTime: Math.floor(new Date().getTime() / 1000),
  });

  const blockNumber = remoteData?._meta?.block.number;
  // const { data: trades } = useAheadTrades(data, account, false);
  const { data } = useAugmentedTrades(remoteData);
  // console.log(`data: `, data);
  useEffect(() => {
    let activeResponseArr = [];
    if (!data) return;
    activeResponseArr = data?.queuedTrades;
    activeResponseArr = [...activeResponseArr, ...data.activeTrades];

    activeResponseArr = getProcessedTrades(
      activeResponseArr,
      blockNumber,
      [],
      true
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
      null,
      true
    );

    setTrades({
      active: activeResponseArr?.filter((a) => a),
      history: historyResponseArr?.filter((a) => a),
      cancelled: cancelledResponseArr?.filter((a) => a),
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
    account,
  ]);
};
