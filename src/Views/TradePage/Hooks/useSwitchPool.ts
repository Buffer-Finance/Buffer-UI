import { ammountAtom } from '@Views/BinaryOptions/PGDrawer';
import { useAtomValue } from 'jotai';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useMemo } from 'react';
import { lt } from '@Utils/NumString/stringArithmatics';
import { appConfig } from '../config';
import { useActiveMarket } from './useActiveMarket';
import { useActivePoolObject } from './useActivePoolObject';
import { activePoolObjAtom } from '../atoms';

export const useSwitchPool = () => {
  const { activeMarket: activePair } = useActiveMarket();
  const { activePool } = useAtomValue(activePoolObjAtom);
  const userInput = useAtomValue(ammountAtom);
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const { activePoolObj } = useActivePoolObject();

  const activePolPool = useMemo(() => {
    if (!activePair) {
      return null;
    }
    return activePair.pools.find(
      (pool) =>
        configData.poolsInfo[pool.pool].is_pol &&
        configData.poolsInfo[pool.pool].token === activePool
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

  const poolDetails = useMemo(() => {
    if (!switchPool) {
      return null;
    }
    return configData.poolsInfo[
      switchPool.pool as keyof typeof configData.poolsInfo
    ];
  }, [switchPool]);

  // console.log(`switchPool: `, switchPool, poolDetails);

  return { switchPool, poolDetails };
};
