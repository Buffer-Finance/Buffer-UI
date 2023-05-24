import { useParams } from 'react-router-dom';
import { useV3AppConfig } from '../useV3AppConfig';
import { getActiveMarket } from '../V3AppComponents/V3ActiveAsset';
import { useMemo } from 'react';

export const useV3AppActiveMarket = () => {
  const params = useParams();
  const appConfig = useV3AppConfig();
  const activeMarket = useMemo(
    () => getActiveMarket(appConfig, params),
    [appConfig, params]
  );
  return { activeMarket };
};
