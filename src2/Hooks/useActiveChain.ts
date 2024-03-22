import Config from 'public/config.json';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getChains } from 'src/Config/wagmiClient';
import { Chain, useNetwork } from 'wagmi';
const typeofConfig = Config[421613];

export const useActiveChain = () => {
  const { chain } = useNetwork();
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
      if (chain === undefined) {
        activeChain = chains[0];
        isWrongChain = true;
      } else {
        const connectedChain = chains.find(
          (fromAllchain) => fromAllchain.name === chain.name
        );
        if (connectedChain === undefined) {
          activeChain = chains[0];
          isWrongChain = true;
        } else {
          activeChain = connectedChain;
        }
      }
      // activeChain = chain;
      // if (!chains.filter((c) => c.name == chain?.name)?.length) {
      //   activeChain = chains[0];
      //   isWrongChain = true;
      // }
    }
    return [activeChain, isWrongChain];
  }, [chain, chainName]);

  return {
    activeChain,
    isWrongChain,

    chainInURL: chainName,
  };
};
