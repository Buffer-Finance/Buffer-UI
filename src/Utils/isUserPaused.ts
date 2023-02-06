import { debounce } from "@mui/material";
import { atom, useSetAtom } from "jotai";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

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
  // Previously called time of the function
  let prev = 0;
  return (...args) => {
    // Current called time of the function
    let now = new Date().getTime();

    // Logging the difference between previously
    // called and current called timings

    // If difference is greater than delay call
    // the function again.
    if (now - prev > delay) {
      prev = now;

      // "..." is the spread operator here
      // returning the function with the
      // array of arguments
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
    // document.onmousemove = cb;
  }, []);
}
export { UserActivityAtom };

// ui . . . . . . ui
//    |         |
// last ui     last ui was 6 seconds before which is > 5, so we make state as stale.
// was 1
// second before

// onScreen && ui

// onEvery stream read,

// whenever state is stale, we refresh the price fetchin
