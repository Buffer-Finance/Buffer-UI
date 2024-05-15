export const getAssetImageUrl = (asset: string) => {
  const assetName = asset.includes('.e') ? asset.split('.e')[0] : asset;
  return `https://res.cloudinary.com/dtuuhbeqt/image/upload/w_50,h_50,c_fill,r_max/Assets/${assetName}.png`;
};

export const getAssetMonochromeImageUrl = (asset: string) => {
  const assetName = asset.includes('.e') ? asset.split('.e')[0] : asset;

  return `https://res.cloudinary.com/dtuuhbeqt/image/upload/w_50,h_50,c_fill,r_max/Assets/monochromes/${assetName}.png`;
};
