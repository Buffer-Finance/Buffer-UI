import { atom } from 'jotai';

export const SettlementFeesChangedConfigAtom = atom<null | {
  [key: string]: { [key: string]: number };
}>(null);

export const StartTimeAtom = atom<number | null>(null);
