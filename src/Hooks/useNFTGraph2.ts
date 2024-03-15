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

export const useNFTGraph2 = (user: string) => {
  const account = user;
  const { data } = useSWR(`nfts-the-graph-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-mainnet/api',
        {
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
        }
      );
      // console.log(response.data, "response");
      return response.data?.data as {
        nfts: IGraphNFT[];
      };
    },
  });
  // console.log(`data: `, data);

  return {
    nfts: data?.nfts as IGraphNFT[],
  };
};
export enum Tier {
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
}

export const useHighestTierNFT2 = (user: string) => {
  const { nfts } = useNFTGraph2(user);
  console.log(`nfts: `, nfts);
  const account = user;
  const highestTierNFT = useMemo(() => {
    if (!nfts || nfts.length === 0) return null;
    const filteredNFTS = nfts.filter((nft) => nft.tier.length > 0);
    return filteredNFTS.reduce((prev, curr) => {
      if (Tier[prev.tier.toUpperCase()] < Tier[curr.tier.toUpperCase()])
        return curr;
      return prev;
    }, filteredNFTS[0]);
  }, [nfts, account]);
  console.log(`highestTierNFT: `, highestTierNFT);
  return { highestTierNFT };
};
