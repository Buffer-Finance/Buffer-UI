import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAccount } from 'wagmi';
import NumberTooltip from './Tooltips';

export default function NFTtier({ userOnly }: { userOnly: boolean }) {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: userOnly });
  const { address: urlAccount } = useUserAccount();
  const { address: userAccount } = useAccount();
  const account = userOnly ? userAccount : urlAccount;
  const TierText = <span className="sm:hidden">Tier</span>;
  if (!account) return <></>;
  if (!highestTierNFT) {
    return (
      <NumberTooltip content={'Bronze Tier'}>
        <div className="group flex items-center justify-center">
          <img src={`/LeaderBoard/Bronze.png`} className="w-5 mr-2" />
          <div className="text-1 font-normal">Bronze</div>
        </div>
      </NumberTooltip>
    );
  } else {
    return (
      <NumberTooltip content={highestTierNFT.tier + ' Tier'}>
        <div className="group flex items-center justify-center gap-2">
          <img
            src={`/LeaderBoard/${highestTierNFT.tier}.png`}
            className="w-5"
          />
          <div className="text-1 font-normal sm:hidden">
            {highestTierNFT.tier}
          </div>
        </div>
      </NumberTooltip>
    );
  }
}
