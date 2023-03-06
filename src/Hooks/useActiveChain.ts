import {  useMemo } from 'react';
import { Chain, useNetwork } from 'wagmi';
import Config from 'public/config.json';

import { arbitrumGoerli } from 'wagmi/chains';
import { getChains } from 'src/Config/wagmiClient';
const typeofConfig = Config[421613];


export const useActiveChain = () => {
  const {chain} = useNetwork();
  const chains = getChains();

  const [activeChain, isWrongChain, configContracts] = useMemo<[Chain,boolean,typeof typeofConfig]>(() => {
    let activeChain = chain;
    let isWrongChain = false;
    if(!chains.filter(c=>c.name == chain?.name)?.length){
      activeChain = chains[0];
      isWrongChain = true;
    }
    return [
      activeChain,
      isWrongChain,
      Config[activeChain.id] as typeof typeofConfig,
    ];
  }, [chain]);
 
  return { activeChain, isWrongChain, configContracts };
};
