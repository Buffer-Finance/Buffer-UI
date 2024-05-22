import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '../config';
import { useMemo } from 'react';
import { configType } from '../type';

export const useDecimalsByAsset = () => {
  const { activeChain } = useActiveChain();
  const config: configType =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

  const decimals = useMemo(() => {
    const response: { [key: string]: number } = {};
    Object.values(config.poolsInfo).forEach((pool) => {
      const tokenName = pool.is_pol ? pool.token + '-POL' : pool.token;
      response[tokenName] = pool.decimals;
    });
    return response;
  }, []);

  return decimals;
};
