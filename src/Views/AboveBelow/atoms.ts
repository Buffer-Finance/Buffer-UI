import { poolInfoType } from '@Views/TradePage/type';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { getAddress } from 'viem';
import { getTimestamps } from './Components/BuyTrade/ExpiryDate/helpers';
import { IreadCallData, accordianTableType, marketTypeAB } from './types';

export const selectedExpiry = atom<number | undefined>(getTimestamps()[0]);

export const aboveBelowMarketsAtom = atom<marketTypeAB[] | null>(null);
export const aboveBelowmarketsSetterAtom = atom(
  null,
  (_get, set, update: marketTypeAB[] | null) => {
    set(aboveBelowMarketsAtom, update);
  }
);
export const aboveBelowAllMarketsAtom = atom<marketTypeAB[] | null>(null);
export const aboveBelowAllMarketsSetterAtom = atom(
  null,
  (_get, set, update: marketTypeAB[] | null) => {
    set(aboveBelowAllMarketsAtom, update);
  }
);

export const urlMarketAtom = atom<string | null>(null);

export const aboveBelowActiveMarketsAtom = atom<marketTypeAB[]>((get) => {
  const markets = get(aboveBelowMarketsAtom);
  const urlMarket = get(urlMarketAtom);
  if (!markets) return [];
  if (!urlMarket) return [];
  return markets.filter((market) => {
    const [token0, token1] = urlMarket.split('-');
    if (market.token0 === token0 && market.token1 === token1) return true;
  });
});
export const setSelectedPoolForTradeAtom = atom<string>('USDC');
export const selectedPoolActiveMarketAtom = atom<marketTypeAB | undefined>(
  (get) => {
    const markets = get(aboveBelowActiveMarketsAtom);
    const selectedPool = get(setSelectedPoolForTradeAtom);
    if (!markets) return undefined;
    return markets.find((market) => {
      if (market.poolInfo.token.toUpperCase() === selectedPool.toUpperCase())
        return true;
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
export const tradeSizeAtom = atomWithStorage<string>(
  'above-below-trade-size',
  '5'
);
export const readCallResponseAtom = atom(
  null,
  (get, set, update: { [callId: string]: [string | boolean | undefined] }) => {
    if (!update) return;
    const balances: { [tokenName: string]: string } = {};
    const allowances: { [tokenName: string]: string } = {};
    const isInCreationWindow: { [category: string]: boolean } = {};
    const maxPermissibleContracts: {
      [contractAddress: string]: {
        isAbove: boolean;
        maxPermissibleContracts: string | undefined;
        strike: string;
      };
    } = {};
    for (const callId in update) {
      const [data] = update[callId];
      if (callId.includes('-balance')) {
        balances[callId.split('-')[0]] = (data ?? '0') as string;
      } else if (callId.includes('-allowance')) {
        allowances[callId.split('-')[0]] = (data ?? '0') as string;
      } else if (callId.includes('-creationWindow')) {
        isInCreationWindow[callId.split('-')[2]] = (data ?? false) as boolean;
      } else if (callId.includes('getMaxPermissibleContracts')) {
        const [contract, strike] = callId.split('getMaxPermissibleContracts');
        maxPermissibleContracts[getAddress(contract) + strike] = {
          isAbove: callId.includes('Above'),
          maxPermissibleContracts: data as string | undefined,
          strike,
        };
      }
    }
    set(readCallDataAtom, {
      balances,
      allowances,
      isInCreationWindow,
      maxPermissibleContracts,
    });
  }
);
export const readCallDataAtom = atom<IreadCallData | undefined>(undefined);

export const selectedPriceAtom = atom<
  | {
      [marketTVid: string]: {
        price: string;
        isAbove: boolean;
      };
    }
  | undefined
>(undefined);
