import { useAtom, useAtomValue } from 'jotai';
import { activeAssetStateAtom, DisplayAssetsAtom, IMarket } from '..';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const useFavouritesFns = () => {
  const [assets, setAssets] = useAtom(DisplayAssetsAtom);
  const navigate = useNavigate();
  const activeMarket = qtInfo.activePair;
  const { routerPermission } = useAtomValue(activeAssetStateAtom);

  function isRouterPermissionTrue(pools: (typeof qtInfo.pairs)[0]['pools']) {
    if (!routerPermission) return false;
    return !!pools.find(
      (pool) => routerPermission[pool.options_contracts.current]
    );
  }

  const includesTradeAvailableAsset = useMemo(() => {
    if (isRouterPermissionTrue(qtInfo.pairs[0].pools)) return true;

    const availablePairs = qtInfo.pairs.filter((market) =>
      isRouterPermissionTrue(market.pools)
    );
    return !!availablePairs.find((market) =>
      isRouterPermissionTrue(market.pools)
    );
  }, [routerPermission, assets]);

  const firstTradeAvailableAsset = useMemo(
    () => qtInfo.pairs.find((market) => isRouterPermissionTrue(market.pools)),
    [includesTradeAvailableAsset]
  );

  useEffect(() => {
    if (assets.length === 0)
      setAssets(
        qtInfo.pairs
          .filter((market) => isRouterPermissionTrue(market.pools))
          .slice(0, 7)
      );
  }, [routerPermission]);

  useEffect(() => {
    if (!includesTradeAvailableAsset) addCardHandler(firstTradeAvailableAsset);
  }, [includesTradeAvailableAsset]);

  const params = useParams();
  useEffect(() => {
    if (activeMarket && !assets.includes(activeMarket.pair)) {
      addCardHandler(activeMarket);
    }
  }, [params?.market]);

  const replaceAssetHandler = (currentAsset: string, isActive: boolean) => {
    navigate(`/binary/${currentAsset}`);
  };

  const deleteCardHandler = (e, currentAsset: IMarket, isActive: boolean) => {
    e.stopPropagation();
    const updatedAssets = assets.filter((pair) => pair !== currentAsset.pair);
    setAssets(updatedAssets);
    if (isActive) replaceAssetHandler(updatedAssets[0], false);
  };

  const addCardHandler = (selectedAsset: IMarket) => {
    if (!selectedAsset) return;
    if (!assets.find((asset) => asset === selectedAsset?.pair)) {
      assets.unshift(selectedAsset.pair);
      if (assets.length > 4) assets.pop();
      setAssets(assets);
    }
  };

  return { replaceAssetHandler, deleteCardHandler, addCardHandler };
};
