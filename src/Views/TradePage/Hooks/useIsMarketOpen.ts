import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getAddress } from 'viem';
import { AssetCategory, marketType } from '../type';
import { buyTradeDataAtom } from './useBuyTradeData';

export const useIsMarketOpen = (
  market: marketType | undefined,
  selectedPoolContract: string | undefined,
  selectedMarketContract: string | undefined
) => {
  // console.log('useIsMarketOpen', market, selectedMarketContract || '');
  const readcallData = useAtomValue(buyTradeDataAtom);
  const isForex =
    market?.category === AssetCategory[AssetCategory.Forex] ||
    market?.category === AssetCategory[AssetCategory.Commodities];

  const isOpen = useMemo(() => {
    if (!readcallData || !market) return false;
    // console.log('useIsMarketOpen', readcallData, market);
    const currentPool = market.pools.find((pool) => {
      return pool.pool === selectedPoolContract;
    });
    console.log(`currentPool: `, currentPool);
    if (currentPool?.isPaused) return false;

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
