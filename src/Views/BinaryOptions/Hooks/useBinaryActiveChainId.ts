import { useMemo } from "react";
import { useQTinfo } from "..";

export const useBinaryActiveChainId = () => {
  const binary = useQTinfo();
  return useMemo(() => 42161, [binary.activeChain]);
};
