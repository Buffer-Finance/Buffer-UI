import { atom } from 'jotai';
import { defaultSelectedTime, defaultSettings } from './config';
import { HHMMToSeconds } from './utils';
import { TradeType, marketType, poolInfoType } from './type';
import { atomWithStorage } from 'jotai/utils';

//Share Atoms
export const shareSettingsAtom = atomWithStorage(
  'shareSettingsAtom',
  defaultSettings.share
);
export const miscsSettingsAtom = atomWithStorage(
  'miscsSettingsAtom',
  defaultSettings.miscs
);
export const tradeSettingsAtom = atomWithStorage(
  'tradeSettingsAtomV3',
  defaultSettings.trade
);
export const notificationPositionSettingsAtom = atomWithStorage(
  'notificationPositionSettingsAtom',
  defaultSettings.notificationPosition
);
export const premiumSettingsAtom = atomWithStorage(
  'premiumSettingsAtom',
  defaultSettings.premium
);
export const tradePanelPositionSettingsAtom = atomWithStorage(
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
export const timeSelectorAtom = atomWithStorage('timeSelectorAtomV2', {
  HHMM: defaultSelectedTime,
  seconds: HHMMToSeconds(defaultSelectedTime),
});

export const setTimeSelectorAtom = atom(null, (get, set, update: string) => {
  set(timeSelectorAtom, { HHMM: update, seconds: HHMMToSeconds(update) });
});

export const tradeSizeAtom = atomWithStorage('tradeSizeAtom', '5');

export const activePoolObjAtom = atomWithStorage('activePoolObjAtom', {
  activePool: 'USDC',
});

// pinned assets and asset selector atoms
export const assetSelectorPoolAtom = atom('USDC');

export const pinnedMarketsAtom = atomWithStorage('pinnedMarketsAtom', ['']);

export const favouriteMarketsAtom = atomWithStorage('favouriteMarketsAtom', [
  '',
]);

export const categoriesAtom = atom<string>('all');

export const searchBarAtom = atom('');

export const radioValueAtom = atom('USDC');

export const chartNumberAtom = atomWithStorage('hello', 1);
export const tradeTypeAtom = atom<'Market' | 'Limit'>('Market');
export const limitOrderStrikeAtom = atom<null | string>(null);

export const isTableShownAtom = atom<boolean>(false);

export const selectedOrderToEditAtom = atom<null | {
  trade: TradeType;
  market: marketType;
}>(null);

export const visualizeddAtom = atom<number[]>([]);

export const ForexTimingsModalAtom = atom<{
  isOpen: boolean;
  marketType: number;
}>({ isOpen: false, marketType: 0 });
export const showOnboardingAnimationAtom = atom<boolean>(false);
export const queuets2priceAtom = atomWithStorage('augmentation-v1', {});
export const closeLoadingAtom = atom<{ [key: number]: 1 | 2 | null }>({});

//share modal atoms
export const ShareStateAtom = atom<{ isOpen: boolean }>({ isOpen: false });
export const SetShareStateAtom = atom(null, (get, set, update: boolean) =>
  set(ShareStateAtom, { isOpen: update })
);
type ShareBetType = {
  trade: TradeType | null;
  expiryPrice: string | null;
  poolInfo: poolInfoType | null;
  market: marketType | null;
};
export const ShareBetAtom = atom<ShareBetType>({
  trade: null,
  expiryPrice: null,
  poolInfo: null,
  market: null,
});
export const SetShareBetAtom = atom(null, (get, set, update: ShareBetType) =>
  set(ShareBetAtom, update)
);

export const approveModalAtom = atom<boolean>(false);
//Trades tables atoms

export const historyTableActivePage = atom<number>(1);
export const cancelTableActivePage = atom<number>(1);
export const platformActiveTableActivePage = atom<number>(1);
export const platformHistoryTableActivePage = atom<number>(1);

export const tradeInspectMobileAtom = atom<{ trade?: TradeType }>({});
