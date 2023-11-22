import { ItournamentData } from '@Views/NoLoss-V3/types';
import { NoLossV3Timer } from '../../NoLossV3Timer';

export const TournamentStatus: React.FC<{
  tournament: ItournamentData;
  isTournamentUpcoming: boolean;
}> = ({ tournament, isTournamentUpcoming }) => {
  const timerHead = isTournamentUpcoming ? 'Starts in' : 'Ends in';
  return (
    <div className="flex justify-between items-center text-f12 mb-2">
      <div className="text-[#C3C2D4]">{tournament.tournamentMeta.name}</div>
      <div className="flex flex-col">
        <div className="text-f10 text-[#7F87A7]">{timerHead}</div>
        <NoLossV3Timer
          className="!mt-[0] !mb-[0] !gap-[0]"
          close={
            isTournamentUpcoming
              ? tournament.tournamentMeta.start
              : tournament.tournamentMeta.close
          }
          isClosed={tournament.state.toLowerCase() === 'closed'}
          shouldShowShortMsg
        />
      </div>
    </div>
  );
};
