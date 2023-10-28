import { divide } from '@Utils/NumString/stringArithmatics';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useAtomValue } from 'jotai';
import { useUpdateActiveTournament } from '../Hooks/useUpdateActiveTournament';
import { activeTournamentIdAtom } from '../atoms';
import { ItournamentData } from '../types';
import { NoLossV3Timer } from './NoLossV3Timer';
import { MIcon } from './SVGs/Micon';
import { RankOne } from './SVGs/RankOneIcon';
import { Star } from './SVGs/Star';
import { TradeIcon } from './SVGs/TradeIcon';

export const tournamentButtonStyles =
  '!text-f12 flex items-center gap-x-2 !h-fit !w-fit px-4 py-2';

export const TradepageTournamentCard: React.FC<{
  tournament: ItournamentData;
}> = ({ tournament }) => {
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);
  const { setActiveTournament } = useUpdateActiveTournament();
  function buyPlayTokens() {}
  return (
    <div
      className={`w-[100%]  background-vertical-gradient rounded-[4px] left-border px-[12px] py-[10px] pb-[20px] ${
        tournament.id == activeTournamentId
          ? 'border-[var(--bg-signature)] '
          : 'border-[transparent]'
      }`}
      role="button"
      onClick={() => {
        // if (activeTournament.state == 'Live') setactiveTid(tournament.id);
      }}
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
          <div className="text-3">Play Tokens</div>
          {/* <div>
        {balance ? (
          <Display
            data={divide(balance, playTokenDecimals)}
            className="text-1 content-end"
          />
        ) : (
          <Skeleton className="lc sr !w-[20px] !h-[14px]" />
        )}
      </div> */}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
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
      </div>
      <div className="flex items-center justify-center gap-x-[5px] mt-4">
        {tournament.state.toLowerCase() == 'live' && (
          <BlueBtn
            className={tournamentButtonStyles}
            isDisabled={tournament.id === activeTournamentId}
            onClick={() => {
              setActiveTournament(tournament.id);
            }}
          >
            <TradeIcon />
            Trade
          </BlueBtn>
        )}
        <BlueBtn className={tournamentButtonStyles} onClick={buyPlayTokens}>
          Entry
          <Display
            data={divide(
              tournament.tournamentMeta.ticketCost,
              tournament.buyinTokenDecimals
            )}
            unit={tournament.buyinTokenSymbol}
            precision={0}
          />
        </BlueBtn>
      </div>
    </div>
  );
};
