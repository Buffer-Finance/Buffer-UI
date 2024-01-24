import { Chain } from 'viem';

export function openBlockExplorer(
  address: string,
  activeChain: Chain | undefined
) {
  if (activeChain !== undefined) {
    const activeChainExplorer = activeChain.blockExplorers?.default?.url;
    if (activeChainExplorer === undefined) return;
    window.open(`${activeChainExplorer}/address/${address}`);
  }
}
