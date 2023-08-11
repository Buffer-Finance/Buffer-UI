import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '../config';
import { useMemo } from 'react';
import { configType, poolInfoType } from '../type';

export type poolInfoByAssetType = {
  [key: string]: poolInfoType & { poolAddress: string };
};

export const usePoolByAsset = () => {
  const { activeChain } = useActiveChain();
  const config: configType =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

  const pools = useMemo(() => {
    const response: poolInfoByAssetType = {};
    Object.keys(config.poolsInfo).forEach((key) => {
      const pool = config.poolsInfo[key as keyof typeof config.poolsInfo];
      const tokenName = pool.is_pol
        ? pool.token.toUpperCase() + '-POL'
        : pool.token.toUpperCase();
      response[tokenName] = { ...pool, poolAddress: key };
    });
    return response;
  }, [activeChain]);

  return pools;
};
