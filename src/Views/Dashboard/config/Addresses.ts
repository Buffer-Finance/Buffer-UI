export const CONTRACTS = {
  421613: {
    uniswap: '0xB529f885260321729D9fF1C69804c5Bf9B3a95A5',
    xcal: '0xAaAc379C2Fc98F59bdf26BD4604d4F084310b23D',
    camelot: '0x47ECF602a62BaF7d4e6b30FE3E8dD45BB8cfFadc',
    usdcLiquidityAddress: '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
    bfrLiquidityAddress: '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
    JLPPoolAddress: '0x97dcc5574B76b91008b684C58DfdF95fE39FA772',
    LBTPoolAddress: '0x3A3DA6464bEe25a1d98526402a12241B0787b84C',
  },
  42161: {
    uniswap: '0xB529f885260321729D9fF1C69804c5Bf9B3a95A5',
    xcal: '0xAaAc379C2Fc98F59bdf26BD4604d4F084310b23D',
    camelot: '0x47ECF602a62BaF7d4e6b30FE3E8dD45BB8cfFadc',
    usdcLiquidityAddress: '0xfa1e2dd94d6665bb964192debac09c16242f8a48',
    bfrLiquidityAddress: '0xfa1e2dd94d6665bb964192debac09c16242f8a48',
    JLPPoolAddress: '0x97dcc5574B76b91008b684C58DfdF95fE39FA772',
    LBTPoolAddress: '0x3A3DA6464bEe25a1d98526402a12241B0787b84C',
  },
};
type ContractName = keyof (typeof CONTRACTS)[421613];
type ChainId = keyof typeof CONTRACTS;

export function getContract(chainId: ChainId, name: ContractName) {
  if (!CONTRACTS[chainId]) {
    throw null;
  }
  if (!CONTRACTS[chainId][name]) {
    throw null;
  }
  return CONTRACTS[chainId][name];
}
