import { useAtom, useAtomValue } from 'jotai';
import {
  activeAssetStateAtom,
  FavouriteAtom,
  IMarket,
  useQTinfo,
} from '@Views/BinaryOptions';
import { getAssetTypes } from './getAssetTypes';

export function getFilteredAssets(
  assets: IMarket[],
  searchText: string,
  category: string,
  AssetTypes: string[]
) {
  const [favourites] = useAtom(FavouriteAtom);

  let filteredAssets: IMarket[] = assets;
  if (!!searchText && searchText !== '')
    filteredAssets = assets.filter((asset) =>
      asset.pair.toLowerCase().includes(searchText.toLowerCase())
    );
  console.log(`filteredAssets: `, filteredAssets);
  console.log(`category: `, category);
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
