import { IGraphNFT, Tier } from '@Hooks/useNFTGraph';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';

export const UserImage: React.FC<{ address: string; isFirst?: boolean }> = ({
  address,
  isFirst = false,
}) => {
  const { data } = useSWR(`nfts-the-graph-account-${address}`, {
    fetcher: async () => {
      const response = await axios.post(
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-mainnet/api',
        {
          query: `{ 
                nfts(orderBy: tokenId, orderDirection: desc,where: {owner: "${address}"}) {
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
    refreshInterval: 30000,
  });

  const nfts = data?.nfts;
  const highestTierNFT = useMemo(() => {
    if (!nfts || nfts.length === 0) return null;
    const filteredNFTS = nfts.filter((nft) => nft.tier.length > 0);
    return filteredNFTS.reduce((prev, curr) => {
      if (Tier[prev.tier.toUpperCase()] < Tier[curr.tier.toUpperCase()])
        return curr;
      return prev;
    }, filteredNFTS[0]);
  }, [nfts]);
  return (
    <div className="absolute -top-[20%] m-auto">
      <CircleAroundPicture />
      <div
        className={`w-[90%] h-[90%] rounded-full ${
          isFirst ? 'bg-[#171722]' : 'bg-[#161a27]'
        } absolute top-[0] right-[0] left-[0] bottom-[0] m-auto z-[9]`}
      />
      {highestTierNFT !== null ? (
        <div className="absolute top-[0px] left-[0px] right-[0] bottom-[0] m-auto z-[10]">
          <img
            src={
              'https://gateway.pinata.cloud/ipfs/' +
              highestTierNFT?.nftImage.split('://')[1]
            }
            alt=""
            width={40}
            height={40}
            className={'mt-2 m-auto rounded-full'}
          />
        </div>
      ) : (
        <div className="absolute top-[0px] left-[0px] right-[0] bottom-[0] z-[10]">
          <img
            src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-large/1f419@2x.png"
            width={35}
            height={35}
            className={'mt-[5px] mx-auto'}
          />
        </div>
      )}
    </div>
  );
};

const CircleAroundPicture: React.FC<{}> = ({}) => {
  return (
    <svg
      className="relative"
      width={50}
      height={50}
      viewBox="0 0 113 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M91.378 14.6205C101.378 22.939 108.069 34.5628 110.241 47.3879"
        stroke="#A3E3FF"
        strokeWidth="3"
        stroke-miterlimit="10"
      />
      <path
        d="M64.13 2.52834C69.8912 3.33573 75.4848 5.06554 80.696 7.65134"
        stroke="#A3E3FF"
        strokeWidth="3"
        stroke-miterlimit="10"
      />
      <path
        d="M111 56.5C111 67.2791 107.804 77.8161 101.815 86.7786C95.8266 95.741 87.3148 102.726 77.3563 106.851C67.3977 110.976 56.4396 112.056 45.8676 109.953C35.2956 107.85 25.5847 102.659 17.9627 95.0373C10.3407 87.4153 5.15012 77.7044 3.04723 67.1324C0.944333 56.5604 2.02361 45.6023 6.14859 35.6437C10.2736 25.6852 17.259 17.1734 26.2214 11.1849C35.1839 5.19637 45.7209 2 56.5 2"
        stroke="#3772FF"
        strokeWidth="3"
        stroke-miterlimit="10"
      />
    </svg>
  );
};
