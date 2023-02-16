import {  useMemo } from 'react';
import { Chain, useNetwork } from 'wagmi';
import Config from 'public/config.json';
import { arbitrumGoerli } from 'wagmi/chains';
const typeofConfig = Config[421613];


export const useActiveChain = () => {
  const {chain} = useNetwork();
  console.log(`chain: `,chain);
  const [activeChain, isWrongChain, configContracts] = useMemo<[Chain,boolean,typeof typeofConfig]>(() => {
    return [
      chain || arbitrumGoerli,
      false,
      Config[chain?.id || '421613'] as typeof typeofConfig,
    ];
  }, [chain]);
 
  return { activeChain, isWrongChain, configContracts };
};
