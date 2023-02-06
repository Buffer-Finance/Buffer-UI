import React, { useState, useEffect, useRef, useContext } from "react";

const FAST_INTERVAL = 5000;
const SLOW_INTERVAL = 10000;

// Check if the tab is active in the user browser
const useIsBrowserTabActive = () => {
  const isBrowserTabActiveRef = useRef(true);

  useEffect(() => {
    const onVisibilityChange = () => {
      isBrowserTabActiveRef.current = !document.hidden;
    };
    try {
      window.addEventListener("visibilitychange", onVisibilityChange);
    } catch (err) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      try {
        window.removeEventListener("visibilitychange", onVisibilityChange);
      } catch (err) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    };
  }, []);
  return isBrowserTabActiveRef;
};

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContext = React.createContext({ slow: 0, fast: 0 });
const RefreshContextProvider = ({ children }) => {
  const [slow, setSlow] = useState(0);
  const [fast, setFast] = useState(0);
  const isBrowserTabActiveRef = useIsBrowserTabActive();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setFast((prev) => prev + 1);
      }
    }, FAST_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setSlow((prev) => prev + 1);
      }
    }, SLOW_INTERVAL);
    return () => clearInterval(interval);
  }, [isBrowserTabActiveRef]);

  return (
    <RefreshContext.Provider value={{ slow, fast }}>
      {children}
    </RefreshContext.Provider>
  );
};

function useRefresher() {
  const { fast, slow } = useContext(RefreshContext);
  return { fastRefresh: fast, slowRefresh: slow };
}

export { useRefresher, RefreshContextProvider };
