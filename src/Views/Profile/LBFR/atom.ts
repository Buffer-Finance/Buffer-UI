import { atom } from 'jotai';

export const LBFRatom = atom<{
  isModalOpen: boolean;
  activeModalNumber: number;
}>({ isModalOpen: false, activeModalNumber: 0 });

export const LBFRModalAtom = atom(
  (get) => get(LBFRatom).isModalOpen,
  (get, set, value: boolean) => {
    set(LBFRatom, { ...get(LBFRatom), isModalOpen: value });
  }
);

export const LBFRModalNumberAtom = atom(
  (get) => get(LBFRatom).activeModalNumber,
  (get, set, value: number) => {
    set(LBFRatom, { ...get(LBFRatom), activeModalNumber: value });
  }
);
