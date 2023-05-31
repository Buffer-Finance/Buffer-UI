import { atom } from 'jotai';
import { defaultSettings } from './config';

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
