import axios from 'axios';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useUserAccount } from './useUserAccount';

interface IGraphNFT {
  batchId: string;
  nftImage: string;
  owner: string;
  tier: number;
  tokenId: string;
  phaseId: string;
}

export const useNFTGraph = (a?: any) => {
  const { address: account } = useUserAccount();
  const { data } = useSWR(`nfts-the-graph-account-${account}-claimed`, {
    fetcher: async () => {
      const response = await axios.post('https://ponder.buffer.finance/', {
        query: `{ 
          nfts(where: {owner:"${account}"  }) {
          items {
            batchId
            claimTimestamp
            hasRevealed
            id
            isMigrated
            ipfs
            nftImage
            owner
            phaseId
            tier
            tokenId
          }
  }
        }`,
      });
      const nfts = response.data.data.nfts.items;
      console.log(`nfts: `, nfts);
      return { nfts } as {
        nfts: IGraphNFT[];
      };
    },
    refreshInterval: 1000,
  });

  return { nfts: data?.nfts as IGraphNFT[] };
};
export enum Tier {
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
}

export const tierToLeagueMapping = {
  1: 'Diamond',
  2: 'Platinum',
  3: 'Gold',
  4: 'Silver',
};

export const useHighestTierNFT = (a?: any) => {
  const { nfts } = useNFTGraph();

  const highestTierNFT = useMemo(() => {
    if (!nfts) return null;
    return nfts.sort((a, b) => a.tier - b.tier)?.[0];
  }, [nfts]);
  console.log(`highestTierNFT: `, highestTierNFT);
  if (!highestTierNFT) return { highestTierNFT: null };
  return {
    highestTierNFT: {
      ...highestTierNFT,
      tier: tierToLeagueMapping[highestTierNFT.tier] || 'Bronze',
    },
  };
};
