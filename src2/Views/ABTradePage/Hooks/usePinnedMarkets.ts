import { useAtom, useAtomValue } from 'jotai';
import { pinnedMarketsAtom } from '../atoms';
import { useMarketsConfig } from './useMarketsConfig';
import { useMemo } from 'react';
import { joinStrings } from '../utils';
import { marketType } from '../type';
import { useNavigate } from 'react-router-dom';

export const usePinnedMarkets = () => {
  const [pinnedAssets, setPinnedAssets] = useAtom(pinnedMarketsAtom);
  const markets = useMarketsConfig();
  const navigate = useNavigate();

  const pinnedMarkets = useMemo(() => {
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

  function getMarketPairName(market: marketType) {
    return joinStrings(market.token0, market.token1, '/');
  }

  function pinMarket(market: marketType) {
    if (pinnedAssets.includes(getMarketPairName(market))) {
      return;
    }
    const newMarkets = [...pinnedAssets];
    newMarkets.unshift(getMarketPairName(market));
    setPinnedAssets(newMarkets);
  }

  function navigateToMarket(market: marketType, pageName: string) {
    navigate(`/v2/${joinStrings(market.token0, market.token1, '-')}`);
  }

  function unpinMarket(market: marketType) {
    setPinnedAssets((prev) =>
      prev.filter((item) => item !== getMarketPairName(market))
    );
  }

  return { pinnedMarkets, pinMarket, unpinMarket, navigateToMarket };
};
