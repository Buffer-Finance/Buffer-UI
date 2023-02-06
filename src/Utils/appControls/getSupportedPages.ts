import { CHAIN_CONFIGS } from "config";

const getSupportedPages = (router) => {
  const requestedChain = router.query.chain;
  if (requestedChain && requestedChain !== "") {
    const chainObj =
      CHAIN_CONFIGS[import.meta.env.VITE_ENV.toUpperCase()][
        (requestedChain as string).toUpperCase()
      ];
    if (chainObj) {
      return chainObj.supportedPages as number[];
    }
  }
  return [];
};
export default getSupportedPages;
