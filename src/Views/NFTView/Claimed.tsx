import { NFTContract } from './config';
import { Background } from './style';
import { useNFTGraph } from './useNFTGraph';

export const ClaimedNFT = () => {
  const { nfts } = useNFTGraph();
  console.log(`nfts: `, nfts);

  return (
    <Background className="flexc-center full-width">
      <div className="header xxxmmt m-auto">Claimed NFTs</div>
      {!nfts || nfts.length === 0 ? (
        <div className="flex justify-center py-8 w-full text-f22">
          No NFTs claimed so far.
        </div>
      ) : (
        <div className="px-7 mt-8 center">
          {nfts.map((nft) => (
            <NFTCard
              tier={nft.tier}
              number={nft.tokenId}
              key={nft.tokenId}
              image={nft.nftImage}
            />
          ))}
        </div>
      )}
    </Background>
  );
};

function NFTCard({
  tier,
  number,
  image,
}: {
  tier: string | null | undefined;
  number: string;
  image: string;
}) {
  return (
    <a
      className="nftcard flex-col"
      href={`https://opensea.io/assets/arbitrum/${NFTContract}/${number}`}
      target="_blank"
    >
      <div className="image">
        <img
          src={'https://gateway.pinata.cloud/ipfs/' + image.split('://')[1]}
          className={`background`}
        />
      </div>
      <div className="flex justify-between text-f14 mt-2 font-medium">
        {tier || 'Buffer NFT'} <span className="text-3">#{number}</span>
      </div>
    </a>
  );
}
