import { atom } from 'jotai';

export const SettlementFeesChangedConfigAtom = atom<null | {
  [key: string]: { [key: string]: number };
}>(null);
