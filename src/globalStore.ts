import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const isDrawerOpen = atom<boolean>(false);
export const isLeftPanelOpen = atom<boolean>(true);
export const activeMarketFromStorageAtom = atomWithStorage(
  'user-active-market',
  ''
);
