import { appConfig } from '../config';

export const getConfig = (chainId: number) => {
  return appConfig[chainId as unknown as keyof typeof appConfig];
};
