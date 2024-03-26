import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getAddress } from 'viem';
import {
  categoriesAtom,
  favouriteMarketsAtom,
  radioValueAtom,
  searchBarAtom,
} from '../atoms';
import { marketsForChart } from '../config';
import { AssetCategory, chartDataType, responseObj } from '../type';
import { joinStrings } from '../utils';
import { useMarketsRequest } from './GraphqlRequests/useMarketsRequest';
import { usePoolInfo } from './usePoolInfo';

export type marketData = responseObj & { marketInfo: chartDataType };
export const useMarketsWithChartData = () => {
  const { data: markets } = useMarketsRequest();
  if (markets.optionContracts === undefined) {
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

export const useAssetTableFilters = (group?: string) => {
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
        if (
          favouriteMarkets.includes(
            joinStrings(market.marketInfo.token0, market.marketInfo.token1, '/')
          )
        ) {
          return market;
        }
      });
    } else if (activeCategory.toLowerCase() === 'all') {
      return markets;
    } else {
      return markets.filter((market) => {
        // in mobile, we need search results for all catagories at once so we pass group of all catagories
        const activeGroup = group || activeCategory;
        return (
          AssetCategory[market.category].toUpperCase() ===
          activeGroup.toUpperCase()
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
