import { useMemo } from 'react';
import { getChains } from 'src/Config/wagmiClient';
import { useNetwork } from 'wagmi';
import Config from 'public/config.json';
const typeofConfig = Config[421613];
export const useActiveChain = () => {
  const { chain } = useNetwork();
  console.log(`chain: `,chain);
  const chains = getChains();
  const activeChain = chain

  const isWrongChain = useMemo(() => {
    return chain && chain.id !== activeChain.id;
  }, [chain, chains]);
  return { activeChain, isWrongChain,configContracts:Config[activeChain.id] as typeof typeofConfig };
};
