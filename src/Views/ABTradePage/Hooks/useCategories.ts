import { useMemo } from 'react';
import { useMarketsConfig } from './useMarketsConfig';

export const useCategories = () => {
  const markets = useMarketsConfig();

  const categories = useMemo(() => {
    if (markets === null) {
      return [];
    }
    const categories = markets.map((market) => market.category);
    return ['favourites', 'all', ...new Set(categories)];
  }, [markets]);
  return { categories };
};
