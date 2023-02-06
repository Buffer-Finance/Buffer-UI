export const CONTRACTS = {
  421613: {
    'USDC-reader': '0xaB9Babe3A7445333d8c2BAA0A5bF749cF37096b5',
    'BFR-reader': '0xcEe87B78A887a5883AD95187eA75D6a2e192dc79',
  },
  42161: {
    'USDC-reader': '0x5254C2894FaC60FF66ba008A4362D828d8a087E2',
  },
};

type contractNameType = 'USDC-reader' | 'BFR-reader';

export function getContract(chainId: number, name: contractNameType) {
  if (!CONTRACTS[chainId]) {
    return null;
  }
  if (!CONTRACTS[chainId][name]) {
    return null;
  }
  return CONTRACTS[chainId][name];
}
