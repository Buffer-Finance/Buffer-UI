import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '../config';
import { useCallback } from 'react';

export const usePoolInfo = () => {
  const { activeChain } = useActiveChain();
  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;
  const getPoolInfo = useCallback(
    (pool: string) => {
      return pools[pool as keyof typeof pools];
    },
    [activeChain]
  );

  return { getPoolInfo };
};
