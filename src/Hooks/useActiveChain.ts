import { useMemo } from 'react';
import { getChains } from 'src/Config/wagmiClient';
import { useNetwork } from 'wagmi';

export const useActiveChain = () => {
  const { chain } = useNetwork();
  const chains = getChains();
  const activeChain = useMemo(() => {
    if (chain && chains.includes(chain)) return chain;
    else return chains[0];
  }, [chain, chains]);

  const isWrongChain = useMemo(() => {
    return chain && chain.id !== activeChain.id;
  }, [chain, chains]);
  return { activeChain, isWrongChain };
};
