import { appConfig, earnConfigType } from '@Views/ABTradePage/config';

export function getContract(chainId: number, name: earnConfigType) {
  const CONTRACTS =
    appConfig[chainId as unknown as keyof typeof appConfig].EarnConfig;
  if (!CONTRACTS) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  if (!CONTRACTS[name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }
  return CONTRACTS[name];
}
