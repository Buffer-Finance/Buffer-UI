import { useActiveChain } from '@Hooks/useActiveChain';
import { useCallback } from 'react';
import { appConfig } from '../config';
import { poolInfoType } from '../type';

export const usePoolInfo = () => {
  const { activeChain } = useActiveChain();
  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;

  const getPoolInfo = useCallback(
    (pool: string): poolInfoType => {
      return pools[pool as keyof typeof pools];
    },
    [pools, activeChain]
  );

  return { getPoolInfo };
};
