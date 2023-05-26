import { V3AppConfig } from '@Views/V3App/useV3AppConfig';

export const getAssetTypes = (assets: V3AppConfig[]) => {
  let types = new Set<string>();
  assets.forEach((asset) => {
    const type = asset.category;
    types.add(type.toLowerCase());
  });
  return ['favourites', ...types];
};
