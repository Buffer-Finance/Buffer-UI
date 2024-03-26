import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '@Views/ABTradePage/config';
import { useMemo } from 'react';

export const usePoolNames = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  return useMemo(() => {
    return Object.values(config.poolsInfo).map((pool) => {
      if (pool.is_pol) {
        return pool.token.toUpperCase() + '_POL';
      }
      return pool.token.toUpperCase();
    });
  }, [activeChain]);
};
