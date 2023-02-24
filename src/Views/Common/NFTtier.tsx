import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useAccount } from 'wagmi';

export default function NFTtier({ userOnly }: { userOnly: boolean }) {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: userOnly });
  const { address } = useAccount();
  if (!address) return <></>;
  if (!highestTierNFT) {
    return (
      <div className="group flex items-center justify-center">
        <img src={`/LeaderBoard/Bronze.png`} className="w-5 mr-2" />
        <div className="text-1 font-normal">Bronze Tier</div>
      </div>
    );
  } else {
    return (
      <div className="group flex items-center justify-center ">
        <img
          src={`/LeaderBoard/${highestTierNFT.tier}.png`}
          className="w-5 mr-2"
        />
        <div className="text-1 font-normal">{highestTierNFT.tier} Tier</div>
      </div>
    );
  }
}
