import { useMemo } from 'react';
import { Chain, useNetwork } from 'wagmi';
import Config from 'public/config.json';
import { getChains } from 'src/Config/wagmiClient';
import { useParams } from 'react-router-dom';
const typeofConfig = Config[421613];

export const useActiveChain = () => {
  const { chain } = useNetwork();
  const chains = getChains();
  const params = useParams();
  const chainName = params.chain;

  const [activeChain, isWrongChain, configContracts] = useMemo<
    [Chain, boolean, typeof typeofConfig]
  >(() => {
    let activeChain: Chain | undefined = undefined;
    let isWrongChain = false;
    if (chainName !== undefined) {
      console.log(chainName, 'chainName');
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
    return [
      activeChain,
      isWrongChain,
      Config[activeChain.id] as typeof typeofConfig,
    ];
  }, [chain, chainName]);

  return {
    activeChain,
    isWrongChain,
    configContracts,
    chainInURL: chainName,
  };
};
