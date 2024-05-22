export const formatAsset = (token0: string, token1: string) => {
  if (token1.toLowerCase() == 'usd') return token0;
  return token0 + '-' + token1;
};
