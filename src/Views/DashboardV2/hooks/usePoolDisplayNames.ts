import { useMemo } from 'react';
import { usePoolNames } from './usePoolNames';

export const usePoolDisplayNames = () => {
  const pools = usePoolNames();

  const mappings = useMemo(() => {
    const returnObj: {
      poolDisplayNameMapping: { [key: string]: string };
      poolDisplayKeyMapping: { [key: string]: string };
    } = {
      poolDisplayNameMapping: {},
      poolDisplayKeyMapping: {},
    };
    pools.forEach((pool) => {
      if (pool.toUpperCase().includes('_POL')) {
        returnObj.poolDisplayNameMapping[pool] = pool.replace('_POL', '');
        returnObj.poolDisplayKeyMapping[pool] = pool.replace('_', '-');
      } else {
        returnObj.poolDisplayNameMapping[pool] = pool;
        returnObj.poolDisplayKeyMapping[pool] = pool;
      }
    });
    return returnObj;
  }, [pools]);

  return {
    ...mappings,
  };
};
