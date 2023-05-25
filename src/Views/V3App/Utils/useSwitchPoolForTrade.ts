import { ammountAtom } from '@Views/BinaryOptions/PGDrawer';
import { useAtomValue } from 'jotai';
import { useV3AppActiveMarket } from './useV3AppActiveMarket';
import { useActiveChain } from '@Hooks/useActiveChain';
import { v3AppConfig } from '../config';
import { useMemo } from 'react';
import { atomWithLocalStorage } from '@Views/BinaryOptions/Components/SlippageModal';
import { lt } from '@Utils/NumString/stringArithmatics';

export const useSwitchPoolForTrade = () => {
  const { activeMarket: activePair } = useV3AppActiveMarket();
  const { activePool } = useAtomValue(v3ActivePoolAtom);
  const userInput = useAtomValue(ammountAtom);
  const { activeChain } = useActiveChain();
  const configData =
    v3AppConfig[activeChain.id as unknown as keyof typeof v3AppConfig];
  const { activePoolObj } = useV3ActivePoolObj();

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

const v3ActivePoolAtom = atomWithLocalStorage('v3-last-selected-pool-v1', {
  activePool: 'USDC',
});

export const useV3ActivePoolObj = () => {
  const { activeMarket: activePair } = useV3AppActiveMarket();
  const { activePool } = useAtomValue(v3ActivePoolAtom);
  const { activeChain } = useActiveChain();
  const configData =
    v3AppConfig[activeChain.id as unknown as keyof typeof v3AppConfig];
  const defaultPool = useMemo(() => {
    if (!activePair) {
      return null;
    }
    return activePair.pools[0];
  }, [activePair]);

  const poolsNotPOL = useMemo(() => {
    if (!activePair) {
      return null;
    }
    return activePair.pools.filter(
      (pool) => !configData.poolsInfo[pool.pool].is_pol
    );
  }, [activePair]);

  const poolNameList = useMemo(() => {
    if (!poolsNotPOL) {
      return null;
    }
    return poolsNotPOL.map((pool) => configData.poolsInfo[pool.pool].token);
  }, [activePair]);

  const activePoolObj = useMemo(() => {
    if (!activePair || !poolsNotPOL) {
      return defaultPool;
    }
    const pool = poolsNotPOL.find(
      (pool) => configData.poolsInfo[pool.pool].token === activePool
    );
    if (!pool) {
      return defaultPool;
    }
    return pool;
  }, [activePair, poolsNotPOL, activePool, defaultPool]);

  return { activePoolObj, poolNameList };
};
