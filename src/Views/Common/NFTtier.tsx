import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAccount } from 'wagmi';

export default function NFTtier({ userOnly }: { userOnly: boolean }) {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: userOnly });
  const { address: urlAccount } = useUserAccount();
  const { address: userAccount } = useAccount();
  const account = userOnly ? userAccount : urlAccount;
  const TierText = <span className="sm:hidden">Tier</span>;
  if (!account) return <></>;
  if (!highestTierNFT) {
    return (
      <div className="group flex items-center justify-center">
        <img src={`/LeaderBoard/Bronze.png`} className="w-5 mr-2" />
        <div className="text-1 font-normal">Bronze {TierText}</div>
      </div>
    );
  } else {
    return (
      <div className="group flex items-center justify-center ">
        <img
          src={`/LeaderBoard/${highestTierNFT.tier}.png`}
          className="w-5 mr-2"
        />
        <div className="text-1 font-normal">
          {highestTierNFT.tier} {TierText}
        </div>
      </div>
    );
  }
}
