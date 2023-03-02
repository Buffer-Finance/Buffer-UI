import { CONTRACTS } from './Address';

export const NFTContract =
  import.meta.env.VITE_ENV.toLowerCase() === 'mainnet'
    ? CONTRACTS[42161].nft
    : CONTRACTS[421613].nft;
