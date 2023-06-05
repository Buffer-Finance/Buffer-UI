import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useMarketsConfig } from './useMarketsConfig';
import { getActiveMarket } from '@Views/V3App/Utils/getActiveMarket';

export const useActiveMarket = () => {
  const params = useParams();
  const appConfig = useMarketsConfig();
  const activeMarket = useMemo(
    () => getActiveMarket(appConfig, params),
    [appConfig, params]
  );
  return { activeMarket };
};
