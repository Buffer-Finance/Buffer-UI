import { atom } from 'jotai';
import { defaultSelectedTime, defaultSettings } from './config';
import { HHMMToSeconds } from './utils';
import { atomWithLocalStorage } from '@Utils/atomWithLocalStorage';
import { OngoingTradeSchema, marketType } from './type';

//Share Atoms
export const shareSettingsAtom = atomWithLocalStorage(
  'shareSettingsAtom',
  defaultSettings.share
);
export const miscsSettingsAtom = atomWithLocalStorage(
  'miscsSettingsAtom',
  defaultSettings.miscs
);
export const tradeSettingsAtom = atomWithLocalStorage(
  'tradeSettingsAtomV2',
  defaultSettings.trade
);
export const notificationPositionSettingsAtom = atomWithLocalStorage(
  'notificationPositionSettingsAtom',
  defaultSettings.notificationPosition
);
export const premiumSettingsAtom = atomWithLocalStorage(
  'premiumSettingsAtom',
  defaultSettings.premium
);
export const tradePanelPositionSettingsAtom = atomWithLocalStorage(
  'tradePanelPositionSettingsAtom',
  defaultSettings.tradePanelPosition
);

export const setSettingsAtom = atom(
  null,
  (get, set, update: typeof defaultSettings) => {
    set(shareSettingsAtom, update.share);
    set(miscsSettingsAtom, update.miscs);
    set(tradeSettingsAtom, update.trade);
    set(notificationPositionSettingsAtom, update.notificationPosition);
    set(premiumSettingsAtom, update.premium);
    set(tradePanelPositionSettingsAtom, update.tradePanelPosition);
  }
);

//BuyTrade Atoms
export const timeSelectorAtom = atomWithLocalStorage('timeSelectorAtom', {
  HHMM: defaultSelectedTime,
  seconds: HHMMToSeconds(defaultSelectedTime),
});

export const setTimeSelectorAtom = atom(null, (get, set, update: string) => {
  set(timeSelectorAtom, { HHMM: update, seconds: HHMMToSeconds(update) });
});

export const tradeSizeAtom = atomWithLocalStorage('tradeSizeAtom', '5');

export const activePoolObjAtom = atomWithLocalStorage('activePoolObjAtom', {
  activePool: 'USDC',
});

// pinned assets and asset selector atoms
export const assetSelectorPoolAtom = atom('USDC');

export const pinnedMarketsAtom = atomWithLocalStorage('pinnedMarketsAtom', [
  '',
]);

export const favouriteMarketsAtom = atomWithLocalStorage(
  'favouriteMarketsAtom',
  ['']
);

export const categoriesAtom = atom<string>('favourites');

export const searchBarAtom = atom('');

export const radioValueAtom = atom('USDC');

export const chartNumberAtom = atomWithLocalStorage('hello', 1);
export const tradeTypeAtom = atom<'Market' | 'Limit'>('Market');
export const limitOrderStrikeAtom = atom<null | string>(null);

export const isTableShownAtom = atom<boolean>(false);

export const selectedOrderToEditAtom = atom<null | {
  trade: OngoingTradeSchema;
  market: marketType;
}>(null);

export const visualizeddAtom = atom<number[]>([]);

export const ForexTimingsModalAtom = atom<boolean>(false);
export const showOnboardingAnimationAtom = atom<boolean>(false);
