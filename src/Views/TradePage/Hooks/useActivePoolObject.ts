import { useActiveMarket } from './useActiveMarket';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { activePoolObjAtom } from '../atoms';
import { usePoolInfo } from './usePoolInfo';

export const useActivePoolObject = () => {
  const { activeMarket: activePair } = useActiveMarket();
  const { activePool } = useAtomValue(activePoolObjAtom);
  const { getPoolInfo } = usePoolInfo();
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
    return activePair.pools.filter((pool) => !getPoolInfo(pool.pool).is_pol);
  }, [activePair]);

  const poolNameList = useMemo(() => {
    if (!poolsNotPOL) {
      return null;
    }
    return poolsNotPOL.map((pool) => getPoolInfo(pool.pool).token);
  }, [activePair]);

  const activePoolObj = useMemo(() => {
    if (!activePair || !poolsNotPOL) {
      return defaultPool;
    }
    const pool = poolsNotPOL.find(
      (pool) => getPoolInfo(pool.pool).token === activePool
    );
    if (!pool) {
      return defaultPool;
    }
    return pool;
  }, [activePair, poolsNotPOL, activePool, defaultPool]);

  return { activePoolObj, poolNameList };
};
