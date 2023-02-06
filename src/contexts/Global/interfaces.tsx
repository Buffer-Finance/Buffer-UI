export interface IAsset {
  name: string;
  img: string;
  category: 'Crypto' | 'Stocks' | 'Currency';
  price_provider?: string;
  faucet?: string[] | { step: string; url: string }[];
}
export interface IOption {
  asset: string;
  abi: any[];
  contract: string;
  version: number;
  type: number;
}
export interface IChain {
  name: string;
  img: string;
  nativeAsset: IAsset;
  chainId: string;
  env: string;
  decimals: number;
  minGasPrice?: number;
  displayName: string;
  gasKey?: string;
}
