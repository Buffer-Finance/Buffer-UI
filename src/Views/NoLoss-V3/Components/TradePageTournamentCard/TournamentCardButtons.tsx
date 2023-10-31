import { useWriteCall } from '@Hooks/useWriteCall';
import { getCallId } from '@Utils/Contract/multiContract';
import { divide, lt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BufferButton } from '@Views/Common/V2-Button';
import { useUpdateActiveTournament } from '@Views/NoLoss-V3/Hooks/useUpdateActiveTournament';
import {
  activeChainAtom,
  tournamentBasedReadCallsReadOnlyAtom,
  userAtom,
} from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { ItournamentData } from '@Views/NoLoss-V3/types';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { erc20ABI } from 'wagmi';
import TournamentManagerABI from '../../ABIs/TournamentManager.json';
import { TradeIcon } from '../SVGs/TradeIcon';

export const tournamentButtonStyles =
  '!text-f12 flex items-center gap-x-2 !h-fit py-2 bg-blue';

export const TournamentCardButtons: React.FC<{
  tournament: ItournamentData;
  activeTournamentId: number | undefined;
}> = ({ tournament, activeTournamentId }) => {
  const { setActiveTournament } = useUpdateActiveTournament();
  const activeChain = useAtomValue(activeChainAtom);
  const user = useAtomValue(userAtom);
  const [btnLoading, setBtnLoading] = useState(false);

  const { writeCall } = useWriteCall();
  const tournamentBasedData = useAtomValue(
    tournamentBasedReadCallsReadOnlyAtom
  );

  if (tournamentBasedData.result === undefined || user === undefined)
    return <Skeleton className="h-4 full-width sr lc mb3" />;
  if (user.userAddress === undefined)
    return (
      <ConnectionRequired>
        <></>
      </ConnectionRequired>
    );

  if (!activeChain) return <></>;
  const config = getNoLossV3Config(activeChain.id);

  const allowanceId = getCallId(
    tournament.tournamentMeta.buyinToken,
    'allowance',
    [user.userAddress, config.manager]
  );
  const allowance =
    tournamentBasedData.result?.buyInTokenToManagerAllowance?.find(
      (allowanceObj) => allowanceObj.id === allowanceId
    )?.allowance;
  const ticketCost = divide(
    tournament.tournamentMeta.ticketCost,
    tournament.buyinTokenDecimals
  ) as string;

  if (allowance === undefined)
    return <Skeleton className="h-4 full-width sr lc mb3" />;

  if (lt(allowance, ticketCost)) {
    const approveTournamentManager = () => {
      setBtnLoading(true);
      writeCall(
        tournament.tournamentMeta.buyinToken,
        erc20ABI as any,
        (response) => {
          setBtnLoading(false);
          console.log(response);
        },
        'approve',
        [config.manager, tournament.tournamentMeta.ticketCost]
      );
    };

    return (
      <BufferButton
        onClick={approveTournamentManager}
        isLoading={btnLoading}
        className={'!text-f12 h-fit bg-blue mt-4 py-2'}
      >
        Approve
      </BufferButton>
    );
  }

  const buyPlayTokens = () => {
    setBtnLoading(true);
    writeCall(
      config.manager,
      TournamentManagerABI,
      (response) => {
        setBtnLoading(false);
        console.log(response);
      },
      'buyTournamentTokens',
      [tournament.id]
    );
  };

  return (
    <div className="flex items-center justify-center gap-x-[5px] mt-4">
      {tournament.state.toLowerCase() == 'live' && (
        <BufferButton
          className={tournamentButtonStyles}
          isDisabled={tournament.id === activeTournamentId}
          onClick={() => {
            setActiveTournament(tournament.id);
          }}
        >
          <TradeIcon />
          Trade
        </BufferButton>
      )}
      <BufferButton
        className={tournamentButtonStyles}
        onClick={buyPlayTokens}
        isLoading={btnLoading}
      >
        Entry
        <Display
          data={ticketCost}
          unit={tournament.buyinTokenSymbol}
          precision={0}
        />
      </BufferButton>
    </div>
  );
};
