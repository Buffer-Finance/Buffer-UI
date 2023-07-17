import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '../config';
import { useMemo } from 'react';
import { configType } from '../type';

export const useDecimalsByAsset = (asset: string) => {
  const { activeChain } = useActiveChain();
  const config: configType = appConfig[activeChain.id];

  const decimals = useMemo(() => {
    return (
      Object.values(config.poolsInfo).find(
        (pool) => pool.token.toLowerCase() === asset.toLowerCase()
      )?.decimals || 0
    );
  }, [asset]);

  return decimals;
};
