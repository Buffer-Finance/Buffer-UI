import React from 'react';
import { Chain } from 'wagmi';

export const DashboardContext = React.createContext<{
  activeChain: Chain;
} | null>(null);

export const DashboardContextProvider = DashboardContext.Provider;
