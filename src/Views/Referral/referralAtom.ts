import { atom } from "jotai";
import React from "react";
import { Chain } from "wagmi";

export const showCodeModalAtom = atom(false);

export const ReferralContext = React.createContext<{
  activeChain: Chain;
} | null>(null);

export const ReferralContextProvider = ReferralContext.Provider;
