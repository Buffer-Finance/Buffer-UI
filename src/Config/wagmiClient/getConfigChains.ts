import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { isTestnet } from 'config';
import {
  arbitrum,
  arbitrumGoerli,
  goerli,
  polygon,
  polygonMumbai,
} from 'viem/chains';

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
      return isTestnet
        ? [polygonMumbai, arbitrumGoerli, goerli]
        : [arbitrum, polygon];
  }
};
