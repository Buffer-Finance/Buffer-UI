import { useMemo } from 'react';
import { AssetCategory, marketType } from '../type';
import { useBuyTradeData } from './useBuyTradeData';
import { getAddress } from 'viem';

export const useIsMarketOpen = (
  market: marketType | undefined,
  selectedPoolContract: string | undefined,
  selectedMarketContract: string | undefined
) => {
  // console.log('useIsMarketOpen', market, selectedMarketContract || '');
  const readcallData = useBuyTradeData();
  const isForex =
    market?.category === AssetCategory[AssetCategory.Forex] ||
    market?.category === AssetCategory[AssetCategory.Commodities];

  const isOpen = useMemo(() => {
    if (!readcallData || !market) return false;
    const currentPool = market.pools.find((pool) => {
      return pool.pool === selectedPoolContract;
    });
    if (!isForex && currentPool?.isPaused) return false;

    if (
      isForex &&
      selectedMarketContract &&
      !readcallData.creationWindows[getAddress(selectedMarketContract)]
    )
      return false;
    return true;
  }, [selectedPoolContract, market, readcallData, selectedMarketContract]);

  return { isMarketOpen: isOpen, isForex };
};
