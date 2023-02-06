import { atom } from 'jotai';

export const drawerAtom = atom<{ isConnectionDrawerOpen: boolean }>({
  isConnectionDrawerOpen: false,
});
