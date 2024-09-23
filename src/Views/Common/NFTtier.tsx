import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAccount } from 'wagmi';

export default function NFTtier({ className }: { className?: string }) {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: false });
  console.log(`NFTtier-highestTierNFT: `, highestTierNFT);
  const { address: urlAccount } = useUserAccount();
  const { address: userAccount } = useAccount();
  const account = urlAccount;
  const TierText = <span className="sm:hidden">Tier</span>;
  if (!account) return <></>;
  if (!highestTierNFT) {
    return (
      <div className={`group flex items-center ${className}`}>
        <img
          src={`/OldLB/LeaderBoard/Bronze.png`}
          className="w-5  mr-1 mt-[3px]"
        />
        <div className="text-[#7F87A7] mr-1 text-f14 font-normal">Bronze</div>
        {/* <InfoIcon sm tooltip="Please update this text!" /> */}
      </div>
    );
  } else {
    return (
      <div className={'group flex items-center ' + className}>
        <img
          src={`/OldLB/LeaderBoard/${highestTierNFT.tier}.png`}
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
