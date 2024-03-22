import { useAtom } from 'jotai';
import { FavouriteAtom } from '@Views/BinaryOptions';
import { MarketInterface } from 'src/MultiChart';

export function getFilteredAssets(
  assets: MarketInterface[],
  searchText: string,
  category: string
) {
  const AssetTypes = ['favourites', 'crypto', 'forex'];
  const [favourites] = useAtom(FavouriteAtom);
  let filteredAssets: MarketInterface[] = [];
  if (!!searchText && searchText !== '')
    filteredAssets = assets.filter((asset) =>
      asset.pair.toLowerCase().includes(searchText.toLowerCase())
    );
  else {
    filteredAssets = assets;
  }
  console.log(`filteredAssets: `, filteredAssets);

  console.log(`category.toLowerCase(): `, category.toLowerCase());
  switch (category.toLowerCase()) {
    case AssetTypes[0]:
      return filteredAssets.filter((asset) => favourites.includes(asset.pair));
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
