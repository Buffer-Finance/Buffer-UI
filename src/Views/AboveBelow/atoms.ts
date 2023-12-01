import { poolInfoType } from '@Views/TradePage/type';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { accordianTableType, marketTypeAB } from './types';

export const selectedExpiry = atom<number | undefined>(undefined);

export const aboveBelowMarketsAtom = atom<marketTypeAB[] | null>(null);
export const aboveBelowmarketsSetterAtom = atom(
  null,
  (_get, set, update: marketTypeAB[] | null) => {
    set(aboveBelowMarketsAtom, update);
  }
);

export const urlMarketAtom = atom<string | null>(null);

export const aboveBelowActiveMarketAtom = atom<marketTypeAB | undefined>(
  (get) => {
    const markets = get(aboveBelowMarketsAtom);
    const urlMarket = get(urlMarketAtom);
    if (!markets) return undefined;
    if (!urlMarket) return undefined;
    return markets.find((market) => {
      const [token0, token1] = urlMarket.split('-');
      if (market.token0 === token0 && market.token1 === token1) return true;
    });
  }
);
export const chartNumberAtom = atomWithStorage('above-below-chartNumber', 1);
export const isTableShownAtom = atom<boolean>(false);

export const activeCategoryAtom = atom<string>('all');
export const searchBarAtom = atom<string>('');
export const favouriteMarketsAtom = atomWithStorage<string[]>(
  'above-below-favourite-markets',
  []
);
export const selectedPoolAtom = atom<poolInfoType | null>(null);

export const filteredMarketsAtom = atom((get) => {
  const markets = get(aboveBelowMarketsAtom);
  const activeCategory = get(activeCategoryAtom);
  const searchBar = get(searchBarAtom);
  const favouriteMarkets = get(favouriteMarketsAtom);
  const selectedPool = get(selectedPoolAtom);

  if (markets === null) return undefined;
  if (selectedPool === null) return undefined;

  const filteredMarkets = markets
    .filter((market) => {
      if (
        market.poolInfo.token.toLowerCase() === selectedPool.token.toLowerCase()
      )
        return true;
      return false;
    })
    .filter((market) => {
      if (activeCategory === 'all') {
        return true;
      } else if (activeCategory === 'favourites') {
        return favouriteMarkets.includes(market.tv_id);
      } else {
        return market.category.toLowerCase() === activeCategory.toLowerCase();
      }
    });

  return filteredMarkets.filter((market) => {
    if (searchBar === '') {
      return true;
    } else {
      return (market.token0 + '-' + market.token1)
        .toLowerCase()
        .includes(searchBar.toLowerCase());
    }
  });
});

export const accordianTableTypeAtom = atom<accordianTableType>('active');
