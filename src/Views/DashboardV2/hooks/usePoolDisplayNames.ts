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
      if (pool.toLowerCase().includes('_e')) {
        returnObj.poolDisplayNameMapping[pool] = pool.replace('_', '.');
      } else if (pool.toUpperCase().includes('_POL')) {
        returnObj.poolDisplayNameMapping[pool] = pool.replace('_POL', '.e');
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
