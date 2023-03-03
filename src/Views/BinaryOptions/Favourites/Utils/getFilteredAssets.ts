import { useAtom } from 'jotai';
import { FavouriteAtom, IMarket, useQTinfo } from '@Views/BinaryOptions';
import { getAssetTypes } from './getAssetTypes';

export function getFilteredAssets(
  assets: IMarket[],
  searchText: string,
  category: string
  // AssetTypes: string[]
) {
  const qtInfo = useQTinfo();
  const AssetTypes = getAssetTypes(qtInfo.pairs);
  const [favourites] = useAtom(FavouriteAtom);

  let filteredAssets: IMarket[] = [];
  if (!!searchText && searchText !== '')
    filteredAssets = assets.filter(
      (asset) =>
        asset.pair.toLowerCase().includes(searchText.toLowerCase()) &&
        !asset.is_paused
    );
  else {
    filteredAssets = assets.filter((asset) => !asset.is_paused);
  }
  switch (category) {
    case AssetTypes[0]:
      return filteredAssets.filter((asset) => favourites.includes(asset.tv_id));
    case AssetTypes[1]:
      return filteredAssets.filter(
        (asset) => asset.category.toLowerCase() === AssetTypes[1].toLowerCase()
      );
    case AssetTypes[2]:
      return filteredAssets.filter(
        (asset) => asset.category.toLowerCase() === AssetTypes[2].toLowerCase()
      );
    case AssetTypes[3]:
      return filteredAssets.filter(
        (asset) => asset.category.toLowerCase() === AssetTypes[3].toLowerCase()
      );
    default:
      return filteredAssets;
  }
}
