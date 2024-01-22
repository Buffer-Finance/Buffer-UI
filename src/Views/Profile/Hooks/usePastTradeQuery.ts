import axios from 'axios';
import { atom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { getAddress } from 'viem';
import { aboveBelowMarketsAtom } from '../atoms';
import { marketTypeAB } from '../types';

enum Link {
  Router = 0,
  Option = 1,
}

export interface TradeInputs {
  id: number;
  state: BetState;
  blockNumber: number;
  link: Link;
  address: string;
}

export enum BetState {
  active = 1,
  exercised = 2,
  expired = 3,
  queued = 4,
  cancelled = 5,
}

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
  state: BetState;
  isAbove: boolean;
  optionContract: {
    address: string;
    token0: string;
    token1: string;
  };
  amount?: string;
  creationTime?: string;
  expirationPrice?: string;
  expirationTime: string;
  payout?: string;
  queueID?: string;
  optionID?: string;
  reason?: string;
  user: string;
  maxFeePerContract?: string;
  numberOfContracts?: string;
  totalFee?: string;
  queueTimestamp?: string;
  cancelTimestamp?: string;
  //added on FE
  blockNumber?: number;
  market: marketTypeAB;
}

export const useProcessedTrades = () => {
  const markets = useAtomValue(aboveBelowMarketsAtom);
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
      return tempTrades
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
            market,
          };
        })
        .filter((trade) => trade !== null);
    },
    [markets]
  );

  return { getProcessedTrades };
};

export const addExpiryPrice = async (currentTrade: IGQLHistory) => {
  if (
    currentTrade.state === BetState.active &&
    currentTrade.optionID &&
    expiryPriceCache[currentTrade.optionID] === undefined
  ) {
    const assets =
      currentTrade.optionContract.token0 + currentTrade.optionContract.token1;
    axios
      .post(`https://oracle.buffer-finance-api.link/price/query/`, [
        {
          pair: assets,
          timestamp: currentTrade.expirationTime,
        },
      ])
      .then((response) => {
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
