import { useAtomValue } from 'jotai';
import {
  categoriesAtom,
  favouriteMarketsAtom,
  radioValueAtom,
  searchBarAtom,
} from '../atoms';
import { useMarketsConfig } from './useMarketsConfig';
import { useMemo } from 'react';
import { joinStrings } from '../utils';
import { usePoolInfo } from './usePoolInfo';

export const useAssetTableFilters = () => {
  const activePool = useAtomValue(radioValueAtom);
  const activeCategory = useAtomValue(categoriesAtom);
  const searchValue = useAtomValue(searchBarAtom);
  const favouriteMarkets = useAtomValue(favouriteMarketsAtom);
  const markets = useMarketsConfig();
  const { getPoolInfo } = usePoolInfo();

  const filteredByCategory = useMemo(() => {
    if (markets === null) {
      return [];
    }
    if (activeCategory.toLowerCase() === 'favourites') {
      return markets.filter((market) => {
        if (
          favouriteMarkets.includes(
            joinStrings(market.token0, market.token1, '/')
          )
        ) {
          return market;
        }
      });
    } else {
      return markets.filter(
        (market) =>
          market.category.toUpperCase() === activeCategory.toUpperCase()
      );
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
        joinStrings(market.token0, market.token1, '-').includes(
          searchValue.toUpperCase()
        )
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
      return !!market.pools.find(
        (pool) =>
          getPoolInfo(pool.pool).token.toUpperCase() ===
          activePool.toUpperCase()
      );
    });
    return filteredMarkets;
  }, [filteredBySearch, activePool, favouriteMarkets]);

  console.log(
    filteredByCategory,
    filteredBySearch,
    filteredByActivePool,
    'filters'
  );

  return { filteredMarkets: filteredByActivePool };
};
