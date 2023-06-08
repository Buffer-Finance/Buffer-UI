import { atom } from 'jotai';
import { defaultSelectedTime, defaultSettings } from './config';
import { HHMMToSeconds } from './utils';

//Share Atoms
export const shareSettingsAtom = atom(defaultSettings.share);
export const miscsSettingsAtom = atom(defaultSettings.miscs);
export const tradeSettingsAtom = atom(defaultSettings.trade);
export const notificationPositionSettingsAtom = atom(
  defaultSettings.notificationPosition
);
export const premiumSettingsAtom = atom(defaultSettings.premium);
export const tradePanelPositionSettingsAtom = atom(
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
export const timeSelectorAtom = atom<{ HHMM: string; seconds: number }>({
  HHMM: defaultSelectedTime,
  seconds: HHMMToSeconds(defaultSelectedTime),
});

export const setTimeSelectorAtom = atom(null, (get, set, update: string) => {
  set(timeSelectorAtom, { HHMM: update, seconds: HHMMToSeconds(update) });
});

export const tradeSizeAtom = atom(5);

export const activePoolObjAtom = atom({
  activePool: 'USDC',
});

// pinned assets and asset selector atoms
export const assetSelectorPoolAtom = atom('USDC');

export const pinnedMarketsAtom = atom<string[]>(['BTC/USD', 'ETH/USD']);

export const favouriteMarketsAtom = atom<string[]>([]);

export const categoriesAtom = atom<string>('favourites');

export const searchBarAtom = atom('');

export const radioValueAtom = atom('USDC');
