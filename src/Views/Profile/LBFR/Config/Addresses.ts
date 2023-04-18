export const CONTRACTS = {
  421613: {
    LBFRfaucet: '',
    LBFR: '',
    LBFRrewardDistributor: '',
    LBFRrewardTracker: '',
  },
  42161: {
    LBFRfaucet: '',
    LBFR: '',
    LBFRrewardDistributor: '',
    LBFRrewardTracker: '',
  },
};

type typeChainId = keyof typeof CONTRACTS;
type typeContractName = keyof (typeof CONTRACTS)[42161];

export function getContract(chainId: typeChainId, name: typeContractName) {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }
  return CONTRACTS[chainId][name];
}
