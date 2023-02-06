import { useMemo } from "react";

export const useHostName = () => {
  return {
    hostname: useMemo(() => {
      if (window) return window.location.hostname;
      else return "app";
    }, [window]),
  };
};
