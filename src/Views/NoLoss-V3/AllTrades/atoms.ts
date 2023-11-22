import { atom } from 'jotai';

export enum tabsNames {
  queued,
  active,
  history,
  cancelled,
}

export const tabsAtom = atom<tabsNames>(tabsNames.queued);

export const historyActivePageAtom = atom<number>(1);
export const cancelledActivePageAtom = atom<number>(1);
export const activeActivePageAtom = atom<number>(1);
export const queuedActivePageAtom = atom<number>(1);
