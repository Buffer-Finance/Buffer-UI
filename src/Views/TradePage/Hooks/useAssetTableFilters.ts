import { useAtomValue } from 'jotai';
import {
  categoriesAtom,
  favouriteMarketsAtom,
  radioValueAtom,
  searchBarAtom,
} from '../atoms';
import { useMemo } from 'react';
import { joinStrings } from '../utils';
import { usePoolInfo } from './usePoolInfo';
import { useMarketsRequest } from './GraphqlRequests/useMarketsRequest';
import { AssetCategory, chartDataType, responseObj } from '../type';
import { marketsForChart } from '../config';
import { getAddress } from 'viem';

export type marketData = responseObj & { marketInfo: chartDataType };
export const useMarketsWithChartData = () => {
  const { data: markets } = useMarketsRequest();

  if (markets === undefined) {
    return [];
  }

  return markets.optionContracts.map((market) => {
    const marketInfo: chartDataType =
      marketsForChart[market.asset as keyof typeof marketsForChart];
    return {
      ...market,
      marketInfo,
    };
  });
};

export const useAssetTableFilters = () => {
  const activePool = useAtomValue(radioValueAtom);
  const activeCategory = useAtomValue(categoriesAtom);
  const searchValue = useAtomValue(searchBarAtom);
  const favouriteMarkets = useAtomValue(favouriteMarketsAtom);
  const markets = useMarketsWithChartData();
  const { getPoolInfo } = usePoolInfo();

  const filteredByCategory = useMemo(() => {
    if (markets === undefined) {
      return [];
    }
    if (activeCategory.toLowerCase() === 'favourites') {
      return markets.filter((market) => {
        if (favouriteMarkets.includes(market.asset)) {
          return market;
        }
      });
    } else {
      return markets.filter((market) => {
        return (
          AssetCategory[market.category].toUpperCase() ===
          activeCategory.toUpperCase()
        );
      });
    }
  }, [markets, activeCategory]);

  const filteredBySearch = useMemo(() => {
    if (filteredByCategory === undefined) {
      return [];
    }
    if (searchValue === '') {
      return filteredByCategory;
    }
    const filteredMarkets = filteredByCategory.filter((market) => {
      if (
        joinStrings(
          market.marketInfo.token0,
          market.marketInfo.token1,
          '-'
        ).includes(searchValue.toUpperCase())
      ) {
        return market;
      }
    });
    return filteredMarkets;
  }, [filteredByCategory, searchValue]);

  const filteredByActivePool = useMemo(() => {
    if (filteredBySearch === undefined) {
      return [];
    }
    const filteredMarkets = filteredBySearch.filter((market) => {
      return (
        getPoolInfo(getAddress(market.poolContract)).token.toUpperCase() ===
        activePool.toUpperCase()
      );
    });
    return filteredMarkets;
  }, [filteredBySearch, activePool, favouriteMarkets]);

  return { filteredMarkets: filteredByActivePool };
};
