import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAccount } from 'wagmi';

export default function NFTtier({
  userOnly,
  className = '',
}: {
  userOnly: boolean;
  className?: string;
}) {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: userOnly });
  const { address: urlAccount } = useUserAccount();
  const { address: userAccount } = useAccount();
  const account = userOnly ? userAccount : urlAccount;
  const TierText = <span className="sm:hidden">Tier</span>;
  if (!account) return <></>;
  if (!highestTierNFT) {
    return (
      <div className={`group flex items-center ${className}`}>
        <img src={`/LeaderBoard/Bronze.png`} className="w-5  mr-1 mt-[3px]" />
        <div className="text-[#7F87A7] mr-1 text-f14 font-normal">Bronze</div>
        {/* <InfoIcon sm tooltip="Please update this text!" /> */}
      </div>
    );
  } else {
    return (
      <div className="group flex items-center ">
        <img
          src={`/LeaderBoard/${highestTierNFT.tier}.png`}
          className="w-5 mr-1 mt-[3px]"
        />
        <div className="text-[#7F87A7] mr-1 text-f14 font-normal sm:hidden">
          {highestTierNFT.tier}
        </div>
        {/* <InfoIcon sm tooltip="Please update this text!" /> */}
      </div>
    );
  }
}
