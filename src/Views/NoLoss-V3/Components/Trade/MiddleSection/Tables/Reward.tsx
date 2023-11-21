import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { getValueOfPercentage } from '@Views/NoLoss-V3/Components/TradePageTournamentCard';
import { useClaimFunction } from '@Views/NoLoss-V3/Hooks/useClaimFunction';
import { ItournamentData } from '@Views/NoLoss-V3/types';

export const Reward: React.FC<{
  tournament: ItournamentData;
  rank: number;
  isUser: boolean;
}> = ({ tournament, rank, isUser }) => {
  const { btnLoading, handleClaim } = useClaimFunction();
  const rewards = tournament.tournamentLeaderboard.rewardPercentages.map(
    (percentage) => (
      <div className="flex items-center w-fit gap-3">
        <Display
          data={getValueOfPercentage(
            divide(
              tournament.tournamentRewardPools.toString(),
              tournament.rewardTokenDecimals
            ) as string,
            divide(percentage.toString(), 2) as string
          )}
          unit={tournament.rewardTokenSymbol}
          precision={2}
          className="!justify-start"
        />
        {isUser && (
          <BlueBtn
            onClick={(e) => {
              e.stopPropagation();
              handleClaim(tournament.id);
            }}
            isDisabled={btnLoading || tournament.hasUserClaimed}
            isLoading={btnLoading}
            className="!w-fit !h-fit px-3 py-1 !text-f12"
          >
            {tournament.hasUserClaimed ? 'Already Claimed' : 'Claim'}
          </BlueBtn>
        )}
      </div>
    )
  );

  return <div>{rewards[rank - 1] ?? '-'}</div>;
};
