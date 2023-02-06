import { useAtom, useAtomValue } from "jotai";
import {
  activeAssetStateAtom,
  DisplayAssetsAtom,
  IMarket,
  useQTinfo,
} from "..";
import { replaceAsset } from "@Utils/appControls/replaceAsset";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useFavouritesFns = () => {
  const [assets, setAssets] = useAtom(DisplayAssetsAtom);
  const qtInfo = useQTinfo();
  const navigate = useNavigate();
  const activeMarket = qtInfo.activePair;
  const { routerPermission } = useAtomValue(activeAssetStateAtom);

  const includesTradeAvailableAsset = useMemo(() => {
    if (
      !routerPermission ||
      routerPermission[qtInfo.pairs[0].pools[0].options_contracts.current] ===
        undefined
    )
      return true;
    const availablePairs = qtInfo.pairs.filter(
      (market) => routerPermission?.[market.pools[0].options_contracts.current]
    );
    return !!availablePairs.find(
      (market) => routerPermission[market.pools[0].options_contracts.current]
    );
  }, [routerPermission, assets]);

  const firstTradeAvailableAsset = useMemo(
    () =>
      qtInfo.pairs.find(
        (market) =>
          routerPermission?.[market.pools[0].options_contracts.current]
      ),
    [includesTradeAvailableAsset]
  );

  useEffect(() => {
    if (assets.length === 0)
      setAssets(
        qtInfo.pairs
          .filter(
            (market) =>
              routerPermission?.[market.pools[0].options_contracts.current]
          )
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
    navigate(`/binary/${currentAsset}`)
  };

  const deleteCardHandler = (e, currentAsset: IMarket, isActive: boolean) => {
    e.stopPropagation();
    const updatedAssets = assets.filter((pair) => pair !== currentAsset.pair);
    setAssets(updatedAssets);
    if (isActive) replaceAssetHandler(updatedAssets[0], false);
  };

  const addCardHandler = (selectedAsset: IMarket) => {
    if(!selectedAsset) return;
    if (!assets.find((asset) => asset === selectedAsset?.pair)) {
      assets.unshift(selectedAsset.pair);
      if (assets.length > 5) assets.pop();
      setAssets(assets);
    }
  };

  return { replaceAssetHandler, deleteCardHandler, addCardHandler };
};
