import { useActiveChain } from './useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useUserAccount } from './useUserAccount';

interface IGraphNFT {
  batchId: string;
  nftImage: string;
  owner: string;
  tier: string;
  tokenId: string;
  phaseId: string;
}

export const useNFTGraph = (userOnly = false) => {
  const { address: account } = useUserAccount();
  const { cache } = useSWRConfig();
  const { configContracts } = useActiveChain();
  const { data } = useSWR(`nfts-the-graph-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.LITE, {
        query: `{ 
          nfts(orderBy: tokenId, orderDirection: desc,where: {owner: "${account}"}) {
            batchId
            nftImage
            owner
            tier
            tokenId
            phaseId
          }
        }`,
      });
      // console.log(response.data, "response");
      return response.data?.data as {
        nfts: IGraphNFT[];
      };
    },
    refreshInterval: 300,
  });
  // console.log(`data: `, data);

  return {
    nfts: userOnly
      ? (cache.get(`nfts-the-graph-account-${account}`)?.nfts as
          | IGraphNFT[]
          | undefined)
      : (data?.nfts as IGraphNFT[]),
  };
};
export enum Tier {
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
}

export const useHighestTierNFT = ({
  userOnly = false,
}: {
  userOnly?: boolean;
}) => {
  const { nfts } = useNFTGraph(userOnly);
  const { address: account } = useUserAccount();

  const highestTierNFT = useMemo(() => {
    if (!nfts || nfts.length === 0) return null;
    const filteredNFTS = nfts.filter((nft) => nft.tier.length > 0);
    return filteredNFTS.reduce((prev, curr) => {
      if (Tier[prev.tier.toUpperCase()] < Tier[curr.tier.toUpperCase()])
        return curr;
      return prev;
    }, filteredNFTS[0]);
  }, [nfts, account]);
  // console.log(highestTierNFT, "highestTierNFT");
  return { highestTierNFT };
};
