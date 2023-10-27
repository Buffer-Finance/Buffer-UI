import { config } from '../config';

export const getNoLossV3Config = (chainId: number) => {
  return config[chainId as unknown as keyof typeof config];
};
