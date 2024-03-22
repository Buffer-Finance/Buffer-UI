// @ts-nocheck
// Set of helper functions to facilitate wallet setup

import { CHAIN_CONFIGS } from "../../../config/index";
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chain: string) => {
  const provider = window.ethereum;
  if (provider) {
    const chainConfig = CHAIN_CONFIGS[import.meta.env.VITE_ENV][chain];
    if (!chainConfig) return false;
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainConfig.chainIdHex,
            chainName: chainConfig.chainName,
            nativeCurrency: chainConfig.nativeAsset,
            rpcUrls: chainConfig.rpcUrls,
            blockExplorerUrls: chainConfig.blockExplorerUrls,
          },
        ],
      });

      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

export const switchNetwork = async (chain: string) => {
  const provider = window.ethereum;
  if (provider) {
    const chainConfig = CHAIN_CONFIGS[import.meta.env.VITE_ENV][chain];

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: chainConfig.chainIdHex,
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to switch the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};
/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number
) => {
  const tokenAdded = await window.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `/images/tokens/${tokenAddress}.png`,
      },
    },
  });

  return tokenAdded;
};
