export const CONTRACTS = {
  421613: {
    nft: '0xE943140786721e3458288605f7393D6989441bA2',
  },
  42161: {
    nft: '0x53bD6b734F50AC058091077249A40f5351629d05',
  },
};

export function getContract(chainId: keyof typeof CONTRACTS, name: 'nft') {
  if (!CONTRACTS[chainId]) {
    return null;
  }
  if (!CONTRACTS[chainId][name]) {
    return null;
  }
  return CONTRACTS[chainId][name];
}
