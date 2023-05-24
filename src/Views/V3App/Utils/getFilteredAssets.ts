import { useAtom } from 'jotai';
import { FavouriteAtom } from '@Views/BinaryOptions';
import { V3AppConfig } from '../useV3AppConfig';
import { joinStrings } from '../helperFns';

export function getV3AppFilteredAssets(
  assets: V3AppConfig[],
  searchText: string,
  category: string
) {
  const AssetTypes = ['favourites', 'crypto', 'forex'];
  const [favourites] = useAtom(FavouriteAtom);
  let filteredAssets: V3AppConfig[] = [];
  if (!!searchText && searchText !== '')
    filteredAssets = assets.filter(
      (asset) =>
        asset.token0.toLowerCase().includes(searchText.toLowerCase()) ||
        asset.token1.toLowerCase().includes(searchText.toLowerCase())
    );
  else {
    filteredAssets = assets;
  }
  console.log(`getV3AppFilteredAssets: `, filteredAssets, assets);

  console.log(`category.toLowerCase(): `, category.toLowerCase());
  switch (category.toLowerCase()) {
    case AssetTypes[0]:
      return filteredAssets.filter((asset) =>
        favourites.includes(joinStrings(asset.token0, asset.token1, '-'))
      );
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
