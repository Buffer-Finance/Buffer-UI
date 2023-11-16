import { activeChainSignal } from '@Views/NoLoss-V3/atoms';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChains } from 'src/Config/wagmiClient';
import { Chain, useNetwork } from 'wagmi';

export const useActiveChain = () => {
  const { chain } = useNetwork();
  const params = useParams();
  const chainName = params.chain;
  // const setActivrChain = useSetAtom(activeChainAtom);

  useEffect(() => {
    const chains: Chain[] = getChains();

    let activeChain;
    if (chainName !== undefined) {
      activeChain = chains.find((chain) =>
        chain.name.toUpperCase().includes(chainName.toUpperCase())
      );
    }
    if (activeChain === undefined) {
      activeChain = chain;
      if (!chains.filter((c) => c.name == chain?.name)?.length) {
        activeChain = chains[0];
      }
    }
    activeChainSignal.value = activeChain;
  }, [chain, chainName]);
};
