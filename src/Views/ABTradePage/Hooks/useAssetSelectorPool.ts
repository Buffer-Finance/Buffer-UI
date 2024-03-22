import { useAtom } from 'jotai';
import { assetSelectorPoolAtom } from '../atoms';
import { marketType } from '../type';
import { appConfig } from '../config';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useCallback } from 'react';

export const useAssetSelectorPool = () => {
  const [selectedPool, setSelectedPool] = useAtom(assetSelectorPoolAtom);
  const { activeChain } = useActiveChain();
  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;

  function selectPool(pool: string) {
    setSelectedPool(pool);
  }

  const getSelectedPoolNotPol = useCallback((market: marketType) => {
    return market.pools.find((pool) => {
      const foundPool = pools[pool.pool as keyof typeof pools];
      return foundPool && foundPool.token === selectedPool && !foundPool.is_pol;
    });
  }, []);

  const getSelectedPoolPol = useCallback((market: marketType) => {
    return market.pools.find((pool) => {
      const foundPool = pools[pool.pool as keyof typeof pools];
      return foundPool && foundPool.token === selectedPool && foundPool.is_pol;
    });
  }, []);

  return {
    selectedPool,
    selectPool,
    getSelectedPoolNotPol,
    getSelectedPoolPol,
  };
};
