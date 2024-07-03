import { useMemo } from 'react';
import { Chain, useAccount } from 'wagmi';
import Config from 'public/config.json';
import { getChains } from 'src/Config/wagmiClient';
import { useParams } from 'react-router-dom';
const typeofConfig = Config[421613];

export const useActiveChain = () => {
  const { chain } = useAccount();
  const chains: Chain[] = getChains();
  const params = useParams();
  const chainName = params.chain;

  const [activeChain, isWrongChain] = useMemo<[Chain, boolean]>(() => {
    let activeChain;
    let isWrongChain = false;
    if (chainName !== undefined) {
      activeChain = chains.find((chain) =>
        chain.name.toUpperCase().includes(chainName.toUpperCase())
      );
    }
    if (activeChain === undefined) {
      activeChain = chain;
      if (!chains.filter((c) => c.name == chain?.name)?.length) {
        activeChain = chains[0];
        isWrongChain = true;
      }
    }
    return [activeChain, isWrongChain];
  }, [chain, chainName]);

  return {
    activeChain,
    isWrongChain,

    chainInURL: chainName,
  };
};
