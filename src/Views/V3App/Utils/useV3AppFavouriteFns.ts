import { DisplayAssetsAtom } from '@Views/BinaryOptions';
import { useAtom } from 'jotai';

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { V3AppConfig, useV3AppConfig } from '../useV3AppConfig';
import { joinStrings } from '../helperFns';
import { useV3AppActiveMarket } from './useV3AppActiveMarket';

export const useV3AppFavouritesFns = () => {
  const [assets, setAssets] = useAtom(DisplayAssetsAtom);
  const { activeMarket } = useV3AppActiveMarket();
  const appConfig = useV3AppConfig();
  const params = useParams();
  const navigate = useNavigate();

  //   const firstTradeAvailableAsset = useMemo(() => {
  //     return appConfig?.find(market=>!market.pools.find(pool=>pool.isPaused))
  //   }, [ assets,appConfig]);

  useEffect(() => {
    if (!appConfig) return;
    if (assets.length === 0)
      setAssets(
        appConfig
          ?.filter((market) => !market.pools.find((pool) => pool.isPaused))
          .slice(0, 7)
      );
  }, [appConfig]);

  //   useEffect(() => {
  //     if (!firstTradeAvailableAsset) addCardHandler(firstTradeAvailableAsset);
  //   }, [firstTradeAvailableAsset]);

  useEffect(() => {
    if (
      activeMarket &&
      !assets.includes(joinStrings(activeMarket.pair, activeMarket.type, '-'))
    ) {
      addCardHandler(activeMarket);
    }
  }, [params?.market]);

  const replaceAssetHandler = (currentAsset: string) => {
    navigate(`/binary/${currentAsset}`);
  };

  const deleteCardHandler = (
    e,
    currentAsset: V3AppConfig,
    isActive: boolean
  ) => {
    e.stopPropagation();
    const updatedAssets = assets.filter(
      (pair) =>
        pair !== joinStrings(currentAsset.token0, currentAsset.token1, '-')
    );
    setAssets(updatedAssets);
    if (isActive) replaceAssetHandler(updatedAssets[0]);
  };

  const addCardHandler = (selectedAsset: V3AppConfig) => {
    if (!selectedAsset) return;
    const selectedPair = joinStrings(
      selectedAsset.token0,
      selectedAsset.token1,
      '-'
    );
    if (!assets.find((asset) => asset === selectedPair)) {
      assets.unshift(selectedPair);
      if (assets.length > 4) assets.pop();
      setAssets(assets);
    }
  };

  return { replaceAssetHandler, deleteCardHandler, addCardHandler };
};
