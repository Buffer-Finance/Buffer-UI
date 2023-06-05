import { useActiveChain } from '@Hooks/useActiveChain';
import { useActiveMarket } from './useActiveMarket';
import { appConfig } from '../config';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { activePoolObjAtom } from '../atoms';

export const useActivePoolObject = () => {
  const { activeMarket: activePair } = useActiveMarket();
  const { activePool } = useAtomValue(activePoolObjAtom);
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
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
