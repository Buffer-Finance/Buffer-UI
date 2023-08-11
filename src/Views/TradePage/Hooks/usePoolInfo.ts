import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '../config';
import { poolInfoType } from '../type';
import { useCallback } from 'react';

export const usePoolInfo = () => {
  const { activeChain } = useActiveChain();
  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;

  const getPoolInfo = useCallback(
    (pool: string): poolInfoType => {
      return pools[pool as keyof typeof pools];
    },
    [pools]
  );

  return { getPoolInfo };
};
