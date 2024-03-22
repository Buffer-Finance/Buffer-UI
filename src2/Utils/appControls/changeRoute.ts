export const changeRoute = (
  router: any,
  assetToSwitch: {
    asset?: string;
    chain?: string;
  }
) => {
  router.replace({
    pathname: router.pathname,
    query: { ...router.query, ...assetToSwitch },
  });
};
