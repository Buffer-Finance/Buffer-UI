import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '../config';

export const usePoolInfo = () => {
  const { activeChain } = useActiveChain();
  const pools =
    appConfig[activeChain.id.toString() as keyof typeof appConfig].poolsInfo;

  const getPoolInfo = (pool: string) => {
    return pools[pool as keyof typeof pools];
  };
  return { getPoolInfo };
};
