import { useEffect, useMemo } from 'react';
import { getChains } from 'src/Config/wagmiClient';
import { Chain, useNetwork } from 'wagmi';
import Config from 'public/config.json';
const typeofConfig = Config[421613];


export const useActiveChain = () => {
  const {chain} = useNetwork();
  const [activeChain, isWrongChain, configContracts] = useMemo<[Chain,boolean,typeof typeofConfig]>(() => {
    return [
      chain,
      false,
      Config[chain.id || '421613'] as typeof typeofConfig,
    ];
  }, [chain]);
 
  return { activeChain, isWrongChain, configContracts };
};
