import {  useMemo } from 'react';
import { Chain, useNetwork } from 'wagmi';
import Config from 'public/config.json';

import { arbitrumGoerli } from 'wagmi/chains';
import { getChains } from 'src/Config/wagmiClient';
const typeofConfig = Config[421613];


export const useActiveChain = () => {
  const {chain} = useNetwork();
  const chains = getChains();

  console.log(`chain: `,chain);
  const [activeChain, isWrongChain, configContracts] = useMemo<[Chain,boolean,typeof typeofConfig]>(() => {
    const activeChain = (chain && chains.includes(chain))?chain:chains[0]
    const isWrongChain = (chain && chains.includes(chain))?false:true;
    return [
      activeChain,
      isWrongChain,
      Config[activeChain.id] as typeof typeofConfig,
    ];
  }, [chain]);
 
  return { activeChain, isWrongChain, configContracts };
};
