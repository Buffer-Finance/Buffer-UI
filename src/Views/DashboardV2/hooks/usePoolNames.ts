import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '@Views/TradePage/config';
import { useMemo } from 'react';

export const usePoolNames = () => {
  const { activeChain } = useActiveChain();
  const config = appConfig[activeChain.id as unknown as keyof typeof appConfig];
  return useMemo(() => {
    return Object.values(config.poolsInfo).map((pool) => {
      if (pool.is_pol) {
        return pool.token.toUpperCase() + '_POL';
      }
      // if (pool.token.toLowerCase().includes('.e')) {
      //   return pool.token.split('.')[0];
      // }
      return pool.token.toUpperCase();
    });
  }, [activeChain]);
};
