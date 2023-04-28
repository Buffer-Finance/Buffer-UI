import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';
import { noLossConfig } from './NoLossConfig';

const useNoLossStaticConfig = () => {
  const { activeChain } = useActiveChain();
  const data = useMemo(() => {
    console.log(`activeChain.id: `, activeChain.id);
    const graphUrl = noLossConfig[activeChain.id]?.graph.MAIN;
    console.log(`noLossConfig[activeChain.id]: `, noLossConfig[activeChain.id]);
    const chainId = activeChain.id;
    return { graphUrl, chainId };
  }, [activeChain.id]);
  return data;
};
const useNoLossConfig = () => {
  const config = useNoLossStaticConfig();
  const { data } = useSWR(`config-${config.chainId}`, {
    fetcher: async (name) => {
      const basicQuery = `
      optionContracts(first: 1000) {
        id
        address
        config
        asset
        isPaused
      }
    `;
      console.log(`config.graphUrl: `, config.graphUrl);
      const response = await axios.post(config.graphUrl, basicQuery);
      console.log(`response: `, response);
      return { hello: 'there' };
    },
    // TODO see if there is retrying machanism on swr than only do this req one time
    refreshInterval: 100000,
  });
  return { hello: 'name' };
};

export { useNoLossConfig };
