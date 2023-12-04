import { useSmartAccount } from '@Hooks/AA/useSmartAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { getCallId } from '@Utils/Contract/multiContract';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BufferButton } from '@Views/Common/V2-Button';
import {
  activeChainAtom,
  noLossReadCallsReadOnlyAtom,
  userAtom,
} from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { ItournamentData } from '@Views/NoLoss-V3/types';
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster';
import {
  BatchedSessionRouterModule,
  DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
  DEFAULT_SESSION_KEY_MANAGER_MODULE,
  SessionKeyManagerModule,
} from '@biconomy/modules';
import { Skeleton } from '@mui/material';
import { ethers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { erc20ABI, useAccount } from 'wagmi';
import TournamentLeaderboardABI from '../../ABIs/TournamentLeaderboard.json';
import TournamentManagerABI from '../../ABIs/TournamentManager.json';
import { useUserAccount } from '@Hooks/useUserAccount';
export const tournamentButtonStyles =
  '!text-f14 flex items-center gap-x-2 !h-fit py-2 bg-blue b1200:px-2 ';

export const TournamentCardButtons: React.FC<{
  tournament: ItournamentData;
  activeAllMyTab: 'my' | 'all';
  tournamentBasedData:
    | {
        buyInTokenToManagerAllowance:
          | {
              id: string;
              allowance: string | undefined;
            }[]
          | undefined;
        buyInTokenBalances:
          | {
              id: string;
              balance: string | undefined;
            }[]
          | undefined;
      }
    | undefined;
}> = ({ tournament, activeAllMyTab, tournamentBasedData }) => {
  const activeChain = useAtomValue(activeChainAtom);
  const user = useAtomValue(userAtom);
  const { address } = useAccount();
  const { sendTxn } = useSmartAccount();
  const [btnLoading, setBtnLoading] = useState(false);
  const { result: readCallResults } = useAtomValue(noLossReadCallsReadOnlyAtom);

  const { writeCall } = useWriteCall();

  // smartAccount.getAccountAddress();

  if (user === undefined || user.userAddress === undefined)
    return (
      <ConnectionRequired className="!text-f14 h-fit bg-blue mt-4 py-2">
        <></>
      </ConnectionRequired>
    );
  if (tournamentBasedData === undefined)
    return (
      <Skeleton className="!h-[26px] full-width b1200:!w-[100px] sr lc !mt-4 !transform-none" />
    );
  if (!activeChain) return <></>;
  if (
    tournament.state.toLowerCase() !== 'closed' &&
    +tournament.tournamentMeta.close < Math.floor(Date.now() / 1000)
  ) {
    return <></>;
  }
  const config = getNoLossV3Config(activeChain?.id);

  const allowanceId = getCallId(
    tournament.tournamentMeta.buyinToken,
    'allowance',
    [user.mainEOA, config.manager]
  );
  const allowance = tournamentBasedData?.buyInTokenToManagerAllowance?.find(
    (allowanceObj) => allowanceObj.id === allowanceId
  )?.allowance;

  const ticketCost = divide(
    tournament.tournamentMeta.ticketCost,
    tournament.buyinTokenDecimals
  ) as string;

  if (allowance === undefined)
    return (
      <Skeleton className="!h-[26px] full-width b1200:!w-[100px] sr lc !mt-4 !transform-none" />
    );
  let secondButton = null;
  async function handleClaim() {
    setBtnLoading(true);
    const txn = {
      data: encodeFunctionData({
        abi: TournamentLeaderboardABI,
        args: [tournament.id, address],
        functionName: 'claimReward',
      }),
      to: config.leaderboard,
    };
    await sendTxn([txn]);
    setBtnLoading(false);
  }

  let isAllowed = gt(
    divide(allowance, tournament.buyinTokenDecimals)!,
    ticketCost
  );
  if (tournament.state.toLowerCase() === 'closed' && activeAllMyTab === 'my') {
    const alreadClaimed = tournament.hasUserClaimed;

    secondButton = (
      <BufferButton
        onClick={handleClaim}
        isLoading={btnLoading}
        className={tournamentButtonStyles}
        isDisabled={tournament.hasUserClaimed === true}
      >
        {alreadClaimed ? 'Already Claimed' : 'Claim'}
      </BufferButton>
    );
  } else {
    if (!isAllowed) {
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
          [
            config.manager,
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ]
        );
      };
      return (
        <BufferButton
          onClick={approveTournamentManager}
          isLoading={btnLoading}
          className={tournamentButtonStyles}
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
        [tournament.id, user.userAddress]
      );
    };
    const hasUserBoughtMaxTickets =
      tournament.userBoughtTickets >=
      tournament.tournamentConditions.maxBuyinsPerWallet;
    const maximumparticipantsReached =
      parseInt(tournament.tournamentLeaderboard.userCount) >=
      parseInt(tournament.tournamentConditions.maxParticipants);

    secondButton = (
      <>
        <BufferButton
          onClick={buyPlayTokens}
          isLoading={btnLoading}
          disabled={maximumparticipantsReached || hasUserBoughtMaxTickets}
          className={tournamentButtonStyles}
        >
          {maximumparticipantsReached ? (
            'Sold Out'
          ) : hasUserBoughtMaxTickets ? (
            'Max bought'
          ) : (
            <>
              {+tournament.userBoughtTickets > 0 ? 'Re-Buy' : 'Entry'}
              <Display
                data={ticketCost}
                unit={tournament.buyinTokenSymbol}
                precision={0}
              />
            </>
          )}
        </BufferButton>
      </>
    );
  }

  return (
    <div className="flex b1200:flex-col items-center justify-center gap-[5px] mt-4">
      {secondButton}
    </div>
  );
};
