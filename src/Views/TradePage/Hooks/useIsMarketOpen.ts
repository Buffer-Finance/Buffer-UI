import { useMemo } from 'react';
import { AssetCategory, marketType } from '../type';
import { useBuyTradeData } from './useBuyTradeData';
import { getAddress } from 'viem';

export const useIsMarketOpen = (
  market: marketType | undefined,
  selectedPoolContract: string | undefined
) => {
  const readcallData = useBuyTradeData();
  const isForex =
    market?.category === AssetCategory[AssetCategory.Forex] ||
    market?.category === AssetCategory[AssetCategory.Commodities];

  const isOpen = useMemo(() => {
    if (!readcallData || !market) return false;
    const currentPool = market.pools.find((pool) => {
      if (
        isForex &&
        !readcallData.creationWindows[getAddress(pool.optionContract)]
      )
        return false;
      return pool.pool === selectedPoolContract;
    });
    return !currentPool?.isPaused;
  }, [selectedPoolContract, market, readcallData]);

  return { isMarketOpen: isOpen, isForex };
};
