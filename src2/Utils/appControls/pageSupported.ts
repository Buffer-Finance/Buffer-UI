import { CHAIN_CONFIGS } from "config";

const isPageSupported = (idx: number, router) => {
  let requestedChain = router.query?.chain;

  // requestedChain = "ARBITRUM";

  if (requestedChain && requestedChain !== "") {
    const chainObj =
      CHAIN_CONFIGS[import.meta.env.VITE_ENV.toUpperCase()][
        (requestedChain as string).toUpperCase()
      ];
    return chainObj && chainObj.supportedPages && chainObj.supportedPages[idx]
      ? true
      : false;
  }
  return null;
};
export default isPageSupported;
