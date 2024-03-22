export const CONTRACTS = {
  421613: {
    LBFRfaucet: '0xb4e871c107501C779C6D11d1B33500804bc96B65',
    LBFR: '0x73B845eEea2a392CcE565ee89A235261159E1104',
    LBFRrewardDistributor: '0xc24125470c0BEF1208c68228814d5D748015dAD9',
    LBFRrewardTracker: '0x16be3a1f310189c216Cd907367D73282330831c1',
  },
  42161: {
    LBFRfaucet: '0x06F9a2414Ac91ECe109ede8D41C60fAf2669D6e3',
    LBFR: '0x5B806d42946a08A6C345291771c20165774D9605',
    LBFRrewardDistributor: '0xF868bE7a7df0a8a515Cf41fD6e1400Faf15d8c8F',
    LBFRrewardTracker: '0x0d17734dFdbC386D5DAF1D4d91334E4C67Ca4Bd1',
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
