import { divide } from '@Utils/NumString/stringArithmatics';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { useAtomValue } from 'jotai';
import { activeTournamentIdAtom } from '../../atoms';
import { ItournamentData } from '../../types';
import { NoLossV3Timer } from '../NoLossV3Timer';
import { MIcon } from '../SVGs/Micon';
import { RankOne } from '../SVGs/RankOneIcon';
import { Star } from '../SVGs/Star';
import { TotalWinnersTrophy } from '../SVGs/TotalWinnersTrophy';
import { TournamentCardButtons } from './TournamentCardButtons';

export const TradepageTournamentCard: React.FC<{
  tournament: ItournamentData;
}> = ({ tournament }) => {
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);

  return (
    <div
      className={`w-[100%]  background-vertical-gradient rounded-[4px] left-border px-[12px] py-[10px] pb-[20px] ${
        tournament.id == activeTournamentId
          ? 'border-[var(--bg-signature)] '
          : 'border-[transparent]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-3 font-semibold text-f12">
          {tournament.tournamentMeta.name}
        </div>
        {tournament.state.toLowerCase() == 'live' && (
          <div className="flex gap-1 items-center">
            <Star />
            <div
              className={`text-[8px] font-medium ${'bg-green chip-green-border text-green'}  bg-opacity-20 px-[6px] py-[1px]`}
            >
              {tournament.state}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <NoLossV3Timer close={tournament.tournamentMeta.close} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-col text-f12 items-center">
          <div className="text-3">Prize Pool</div>
          <div>
            {divide(tournament.rewardPool, tournament.rewardTokenDecimals)}
          </div>
        </div>
        <div className="flex-col text-f12 items-end">
          <div className="text-3">Mint Amount</div>
          <div>
            {/* {balance ? ( */}
            <Display
              data={divide(tournament.tournamentMeta.playTokenMintAmount, 18)}
              className="text-1 content-end"
              precision={2}
            />
            {/* ) : (
          <Skeleton className="lc sr !w-[20px] !h-[14px]" />
        )} */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start mt-3 gap-4">
        <div className="flex items-center text-f12 ">
          <RankOne />
          <div className="mt-1  text-1 ml-2">
            {/* <Display
          data={divide(
            tournament.rewards[0],
            tournament.rewardTokenDecimals
          )}
          unit={tournament.rewardTokenSymbol}
        /> */}
          </div>
        </div>

        <NumberTooltip
          content={
            'Only upto ' +
            tournament.tournamentConditions.maxParticipants +
            ' patricipants are allowed for this tournament'
          }
        >
          <div className="flex items-center gap-x-2 text-f12">
            <MIcon />
            Upto {tournament.tournamentConditions.maxParticipants}
          </div>
        </NumberTooltip>

        <div className="flex items-center gap-2">
          <TotalWinnersTrophy />
          <div className="text-f12">?</div>
        </div>
      </div>
      <TournamentCardButtons
        tournament={tournament}
        activeTournamentId={activeTournamentId}
      />
    </div>
  );
};
