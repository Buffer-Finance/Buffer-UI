import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { isTestnet } from 'config';
import { arbitrum, arbitrumGoerli, polygon } from 'viem/chains';

export const urlSettings = getHashUrlQueryParam(window.location.href);

export function getSupportedChains() {
  return isTestnet ? [arbitrumGoerli] : [arbitrum];
}

export const getAllChains = () => {
  switch (urlSettings?.chain) {
    case 'arbitrum':
      return isTestnet ? [arbitrumGoerli] : [arbitrum, polygon];
    case 'polygon':
      return isTestnet ? [arbitrumGoerli] : [polygon, arbitrum];
    default:
      return isTestnet ? [arbitrumGoerli] : [arbitrum, polygon];
  }
};
