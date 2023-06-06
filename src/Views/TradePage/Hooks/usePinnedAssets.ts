import { useAtomValue } from 'jotai';
import { pinnedAssetsAtom } from '../atoms';
import { useMarketsConfig } from './useMarketsConfig';
import { useMemo } from 'react';
import { joinStrings } from '../utils';

export const usePinnedAssets = () => {
  const pinnedAssets = useAtomValue(pinnedAssetsAtom);
  const markets = useMarketsConfig();

  return useMemo(() => {
    if (markets === null) {
      return [];
    }
    if (pinnedAssets.length === 0) {
      return [];
    }
    const pinnedMarkets = markets.filter((market) =>
      pinnedAssets.includes(joinStrings(market.token0, market.token1, '/'))
    );
    return pinnedMarkets;
  }, [pinnedAssets, markets]);
};
