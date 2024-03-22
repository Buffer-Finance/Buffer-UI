export const replaceAsset = (router: any, assetToSwitch) => {
  router.replace({
    pathname: router.pathname,
    query: { ...router.query, asset: assetToSwitch },
  });
};
