import { useUserAccount } from '@Hooks/useUserAccount';
import axios from 'axios';
import { baseGraphqlLiteUrl } from 'config';
import { useMemo } from 'react';
import useSWR from 'swr';
interface IGraphNFT {
  batchId: string;
  nftImage: string;
  owner: string;
  tier: string;
  tokenId: string;
  phaseId: string;
}
export const useNFTGraph = () => {
  const { address: account } = useUserAccount();
  const { data } = useSWR(`nfts-the-graph-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(baseGraphqlLiteUrl.testnet, {
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

  return { nfts: data?.nfts as IGraphNFT[] };
};
export enum Tier {
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
}

export const useHighestTierNFT = () => {
  const { nfts } = useNFTGraph();

  const highestTierNFT = useMemo(() => {
    if (!nfts || nfts.length === 0) return null;
    const filteredNFTS = nfts.filter((nft) => nft.tier.length > 0);
    return filteredNFTS.reduce((prev, curr) => {
      if (Tier[prev.tier.toUpperCase()] < Tier[curr.tier.toUpperCase()])
        return curr;
      return prev;
    }, filteredNFTS[0]);
  }, [nfts]);
  // console.log(highestTierNFT, "highestTierNFT");
  return { highestTierNFT };
};
