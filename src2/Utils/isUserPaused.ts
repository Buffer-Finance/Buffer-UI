import { debounce } from "@mui/material";
import { atom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

const UserActivityAtom = atom({
  ts: Date.now(),
  type: "init",
});
export let evnts = [
  "mousedown",
  "click",
  "mouseup",
  "focus",
  "keyup",
  "blur",
  "keydown",
  "mousemove",
  "focus",
  "keypressed",
];
const throttleFunction = (func, delay) => {
  let prev = 0;
  return (...args) => {
    let now = new Date().getTime();
    if (now - prev > delay) {
      prev = now;
      return func(...args);
    }
  };
};

export const useTVInteractiveSetter = () => {
  const setUserActivity = useSetAtom(UserActivityAtom);
  const cb = useCallback(
    throttleFunction((ev) => {
      if (ev.type && ev.timeStamp) {
        setUserActivity({ ts: Date.now(), type: ev.type });
      }
    }, 400),
    [setUserActivity]
  );
  return { cb };
};

export default function isUserPaused() {
  const { cb } = useTVInteractiveSetter();
  useEffect(() => {
    evnts.forEach((evnt) => {
      window.addEventListener(evnt, cb);
    });
  }, []);
}
export { UserActivityAtom };

