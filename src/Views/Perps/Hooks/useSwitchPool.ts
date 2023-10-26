import { useActiveChain } from '@Hooks/useActiveChain';
import { lt } from '@Utils/NumString/stringArithmatics';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { activePoolObjAtom, tradeSizeAtom } from '../atoms';
import { poolInfoType } from '../type';
import { getConfig } from '../utils/getConfig';
import { useActiveMarket } from './useActiveMarket';
import { useActivePoolObject } from './useActivePoolObject';
import { usePoolInfo } from './usePoolInfo';

export const useSwitchPool = () => {
  const { activeMarket: activePair } = useActiveMarket();
  const { activePool } = useAtomValue(activePoolObjAtom);
  const userInput = useAtomValue(tradeSizeAtom);
  const { activeChain } = useActiveChain();
  const { getPoolInfo } = usePoolInfo();
  const configData = getConfig(activeChain.id);
  const { activePoolObj } = useActivePoolObject();

  const activePolPool = useMemo(() => {
    if (!activePair) {
      return null;
    }
    return activePair.pools.find(
      (pool) =>
        getPoolInfo(pool.pool).is_pol &&
        getPoolInfo(pool.pool).token === activePool
    );
  }, [activePair]);

  const switchPool = useMemo(() => {
    if (!activePoolObj) {
      return null;
    }
    if (!activePolPool) {
      return activePoolObj;
    }
    if (userInput && userInput !== '' && lt(userInput, activePoolObj.min_fee)) {
      return activePolPool;
    }
    return activePoolObj;
  }, [activePolPool, activePoolObj]);

  const poolDetails = useMemo((): poolInfoType | null => {
    if (!switchPool) {
      return null;
    }
    return configData.poolsInfo[
      switchPool.pool as keyof typeof configData.poolsInfo
    ] as poolInfoType;
  }, [switchPool]);

  return { switchPool, poolDetails };
};
