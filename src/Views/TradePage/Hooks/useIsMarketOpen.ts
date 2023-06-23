import { useMemo } from 'react';
import { AssetCategory, marketType, poolInfoType } from '../type';
import { useBuyTradeData } from './useBuyTradeData';

export const useIsMarketOpen = (
  market: marketType | undefined,
  selectedPoolContract: string | undefined
) => {
  const readcallData = useBuyTradeData();
  const isForex = market?.category === AssetCategory[AssetCategory.Forex];

  const isOpen = useMemo(() => {
    if (!readcallData || !market) return false;
    if (!isForex && !readcallData.isInCreationWindow) return false;
    const currentPool = market.pools.find((pool) => {
      return pool.pool === selectedPoolContract;
    });
    return !currentPool?.isPaused;
  }, [selectedPoolContract, market, readcallData]);

  return { isMarketOpen: isOpen, isForex };
};
