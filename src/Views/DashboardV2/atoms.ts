import { atom } from 'jotai';

export const readCallsAtom = atom<null | any[]>(null);

export const readResponseAtom = atom<null | any>(null);

export const setReadCallsAtom = atom(
  null,

  (get, set, update: { readcalls: any[]; activeChainId: number }) => {
    const { readcalls: updateCalls, activeChainId } = update;
    const readCallsLength = updateCalls.length;
    const oldCalls = get(readCallsAtom);
    const prvValue = oldCalls?.filter((item) =>
      item.id.includes(activeChainId.toString())
    );
    const prvValueLength = prvValue?.length || 0;
    const readcalls = updateCalls.filter((call) => {
      if (prvValue) {
        return !prvValue.find((item) => item.id === call.id);
      }
      return true;
    });

    //find the index of the first readcall in the prvValue array
    let startIndex = 0;
    if (
      prvValue !== null &&
      prvValue !== undefined &&
      prvValue.length > 0 &&
      readcalls.length > 0
    ) {
      startIndex = prvValue.findIndex((item) => {
        return item.id === readcalls[0].id;
      });
      if (prvValueLength > 0 && startIndex !== -1) {
        prvValue.splice(startIndex, readCallsLength);
      }
    }

    if (prvValue === undefined) {
      set(readCallsAtom, readcalls);
    } else {
      set(readCallsAtom, [...prvValue, ...readcalls]);
    }
  }
);

export const tokenAtom = atom<string[]>([]);
