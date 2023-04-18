export const CONTRACTS = {
  421613: {
    LBFRfaucet: '0x72B213A8F5a07a148b985d3092259490c916cD0c',
    LBFR: '0x000010eF1E662787555B6290145cE6632726a087',
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

export function getContract(chainId: number, name: typeContractName) {
  if (!CONTRACTS[chainId as typeChainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }
  if (!CONTRACTS[chainId as typeChainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }
  return CONTRACTS[chainId as typeChainId][name];
}
