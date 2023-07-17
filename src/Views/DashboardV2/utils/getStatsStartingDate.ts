import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';

export const getStatsStartingDate = (chainId: number): string => {
  switch (chainId) {
    case arbitrum.id:
    case arbitrumGoerli.id:
      return 'Arbitrum Total Stats (since 30th Jan, 2023)';
    case polygon.id:
    case polygonMumbai.id:
      return 'Polygon Total Stats (since 22nd Feb, 2023)';
    default:
      return 'Arbitrum Total Stats (since 30th Jan, 2023)';
  }
};
