import { atom } from 'jotai';

export const readCallsAtom = atom<null | any[]>(null);

export const readResponseAtom = atom<null | any>(null);

export const setReadCallsAtom = atom(
  null,

  (get, set, update: { readcalls: any[]; isCleanup: boolean }) => {
    const { readcalls: updateCalls, isCleanup } = update;
    const readCallsLength = updateCalls.length;
    const prvValue = get(readCallsAtom);
    const prvValueLength = prvValue?.length || 0;
    const readcalls = updateCalls.filter((call) => {
      if (prvValue) {
        return !prvValue.find((item) => item.id === call.id);
      }
      return true;
    });

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

    if (!isCleanup && readcalls.length > 0) {
      if (prvValue === null) {
        set(readCallsAtom, readcalls);
      } else {
        set(readCallsAtom, [...prvValue, ...readcalls]);
      }
    }
  }
);

export const tokenAtom = atom<string[]>([]);
