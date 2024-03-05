import { atom } from 'jotai';

export const thresholdsAtom = atom<[string, string][]>([]);
export const poolAPRsAtom = atom<[string, string][]>([]);
export const txnSuccessAtom = atom<boolean>(false);
