import axios from 'axios';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import useSWR from 'swr';
import { baseGraphqlLiteUrl } from 'config';

export const useNFTGraph = () => {
  const { address: account } = useUserAccount();
  const { data } = useSWR(`nfts-the-graph-account-${account}`, {
    fetcher: async () => {
      const response = await axios.post(baseGraphqlLiteUrl.sandbox, {
        query: `{ 
nfts(orderBy: tokenId, orderDirection: desc,where: {owner: "${account}"}) {
    batchId
    nftImage
    owner
    tier
    tokenId
  }
          }`,
      });
      return response.data?.data as {
        nfts: {
          batchId: string;
          nftImage: string;
          owner: string;
          tier: string;
          tokenId: string;
        }[];
      };
    },
    refreshInterval: 300,
  });

  return { nfts: data?.nfts };
};
export enum Tier {
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
}
// FIXME remove useMemo, or consider the account change
export const useHighestTierNFT = () => {
  const { nfts } = useNFTGraph();

  const highestTierNFT = useMemo(() => {
    if (!nfts || nfts.length === 0) return null;

    return nfts
      .filter((nft) => !!nft.tier)
      .reduce((prev, curr) => {
        if (Tier[prev.tier.toUpperCase()] < Tier[curr.tier.toUpperCase()])
          return curr;
        return prev;
      }, nfts[0]);
  }, [nfts]);
  return { highestTierNFT };
};
