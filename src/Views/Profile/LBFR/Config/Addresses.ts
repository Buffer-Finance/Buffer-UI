export const CONTRACTS = {
  421613: {
    LBFRfaucet: '0x69061E5E28f153Cdb1F80e460aC8254Fd6791b03',
    LBFR: '0x000010eF1E662787555B6290145cE6632726a087',
    LBFRrewardDistributor: '0xe831dCE9ed8860fD9144E099534EE584FAe6212E',
    LBFRrewardTracker: '0x857cb5A25e99Dfe29A4eE47553607B5e22c03678',
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
