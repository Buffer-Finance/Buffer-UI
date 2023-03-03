import { useAtom } from 'jotai';
import { DisplayAssetsAtom, IMarket, useQTinfo } from '..';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const useFavouritesFns = () => {
  const [assets, setAssets] = useAtom(DisplayAssetsAtom);
  const qtInfo = useQTinfo();
  const navigate = useNavigate();
  const activeMarket = qtInfo.activePair;

  useEffect(() => {
    if (assets.length === 0)
      setAssets(qtInfo.pairs.filter((market) => !market.is_paused).slice(0, 4));
  }, []);

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
