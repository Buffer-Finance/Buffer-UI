import { useAtomValue } from 'jotai';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useMemo } from 'react';
import { lt } from '@Utils/NumString/stringArithmatics';
import { useActiveMarket } from './useActiveMarket';
import { useActivePoolObject } from './useActivePoolObject';
import { activePoolObjAtom, tradeSizeAtom } from '../atoms';
import { usePoolInfo } from './usePoolInfo';
import { poolInfoType } from '../type';
import { getConfig } from '../utils/getConfig';

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

  // console.log(`switchPool: `, switchPool, poolDetails);

  return { switchPool, poolDetails };
};
