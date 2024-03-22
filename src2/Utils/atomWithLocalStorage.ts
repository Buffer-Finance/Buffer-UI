import { WritableAtom, atom } from 'jotai';

export const atomWithLocalStorage = <key, T>(
  key: string,
  initialValue: T
): WritableAtom<T, unknown, void> => {
  if (typeof window == 'undefined') return atom({ dummy: true });
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};
