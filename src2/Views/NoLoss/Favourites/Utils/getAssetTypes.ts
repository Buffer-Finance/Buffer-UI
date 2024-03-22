import { IMarket } from '@Views/BinaryOptions';

export const getAssetTypes = (assets: IMarket[]) => {
  let types = new Set<string>();
  assets.forEach((asset) => {
    const type = asset.category;
    types.add(type.toLowerCase());
  });
  return ['favourites', ...types];
};
