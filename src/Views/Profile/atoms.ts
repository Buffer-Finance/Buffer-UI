import { atom } from 'jotai';
import { marketTypeAB } from './types';

export const aboveBelowMarketsAtom = atom<marketTypeAB[] | null>(null);
export const aboveBelowmarketsSetterAtom = atom(
  null,
  (_get, set, update: marketTypeAB[] | null) => {
    set(aboveBelowMarketsAtom, update);
  }
);
