import { atom } from "jotai";
import { v4 } from "uuid";
export const onlineStatus = atom<undefined | boolean>(
  typeof navigator === "undefined" ? undefined : navigator?.onLine
);

export const visibleStatus = atom<undefined | string>(
  typeof document === "undefined" ? undefined : document?.visibilityState
);

export const sessionAtom = atom((get) => {
  get(onlineStatus);
  get(visibleStatus);
  let token = v4();
  return token;
});
