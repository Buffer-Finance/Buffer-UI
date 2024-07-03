import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { isTestnet } from 'config';
import { arbitrumSepolia as abSepolia } from 'viem/chains';
import { defineChain } from 'viem';
import { arbitrum, polygon, polygonMumbai } from 'viem/chains';

export const urlSettings = getHashUrlQueryParam(window.location.href);
export const arbitrumSepolia = abSepolia;

export function getSupportedChains() {
  return isTestnet ? [abSepolia] : [arbitrum];
}

export const getAllChains = () => {
  switch (urlSettings?.chain) {
    case 'arbitrum':
      return isTestnet ? [arbitrumSepolia, polygonMumbai] : [arbitrum, polygon];
    case 'polygon':
      return isTestnet ? [polygonMumbai, arbitrumSepolia] : [polygon, arbitrum];
    default:
      return isTestnet ? [arbitrumSepolia, polygonMumbai] : [arbitrum, polygon];
  }
};
