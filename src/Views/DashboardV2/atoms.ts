import { atom } from 'jotai';

export const readCallsAtom = atom<null | any[]>(null);

export const readResponseAtom = atom<null | any>(null);

export const setReadCallsAtom = atom(
  null,

  (get, set, update: { readcalls: any[]; isCleanup: boolean }) => {
    const { readcalls, isCleanup } = update;
    const readCallsLength = readcalls.length;
    const prvValue = get(readCallsAtom);
    const prvValueLength = prvValue?.length || 0;

    //find the index of the first readcall in the prvValue array
    let startIndex = 0;
    if (prvValue !== null && prvValue !== undefined) {
      startIndex = prvValue.findIndex((item) => {
        return item[0] === readcalls[0];
      });
      if (prvValueLength > 0 && startIndex !== -1) {
        prvValue.splice(startIndex, readCallsLength);
      }
    }

    if (!isCleanup) {
      if (prvValue === null) {
        set(readCallsAtom, readcalls);
      } else {
        set(readCallsAtom, [...prvValue, ...readcalls]);
      }
    }
  }
);

export const tokenAtom = atom<string[]>([]);
