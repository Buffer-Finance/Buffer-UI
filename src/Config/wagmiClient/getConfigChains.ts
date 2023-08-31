import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { isTestnet } from 'config';
import { arbitrumGoerli, arbitrum, polygonMumbai, polygon } from 'viem/chains';

export const urlSettings = getHashUrlQueryParam(window.location.href);

export function getSupportedChains() {
  return isTestnet ? [arbitrumGoerli] : [arbitrum];
}

export const getAllChains = () => {
  switch (urlSettings?.chain) {
    case 'arbitrum':
      return isTestnet ? [arbitrumGoerli, polygonMumbai] : [arbitrum, polygon];
    case 'polygon':
      return isTestnet ? [polygonMumbai, arbitrumGoerli] : [polygon, arbitrum];
    default:
      return isTestnet ? [arbitrumGoerli, polygonMumbai] : [arbitrum, polygon];
  }
};
