import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { useIsMarketInCreationWindow } from '@Views/NoLoss-V3/Hooks/useIsMarketInCreationWindow';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import {
  activeChainAtom,
  activeMarketDataAtom,
  activeTournamentDataReadOnlyAtom,
  noLossReadCallsReadOnlyAtom,
  noLossTradeSizeAtom,
  userAtom,
} from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { getSlippageError } from '@Views/TradePage/Views/Settings/TradeSettings/Slippage/SlippageError';
import { timeSelectorAtom, tradeSettingsAtom } from '@Views/TradePage/atoms';
import { secondsToHHMM } from '@Views/TradePage/utils';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import RouterABI from '../../../ABIs/NoLossRouter.json';
import TournamentLeaderboardABI from '../../../ABIs/TournamentLeaderboard.json';
import TournamentManagerABI from '../../../ABIs/TournamentManager.json';
import { getDurationError } from './TimeSelector/TimePicker';
import { getTradeSizeError } from './TradeSizeSelector';
import { encodeFunctionData } from 'viem';
import { useSmartAccount } from '@Hooks/AA/useSmartAccount';
import { ethers } from 'ethers';
import {
  SessionKeyManagerModule,
  DEFAULT_SESSION_KEY_MANAGER_MODULE,
  BatchedSessionRouterModule,
  DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
} from '@biconomy/modules';
import { PaymasterMode } from '@biconomy/paymaster';
export const BuyButtons: React.FC<{ activeMarket: InoLossMarket }> = ({
  activeMarket,
}) => {
  const toastify = useToast();
  const { price } = useMarketPrice(activeMarket?.chartData.tv_id);
  const { result: readCallResults } = useAtomValue(noLossReadCallsReadOnlyAtom);
  const user = useAtomValue(userAtom);
  const userInput = useAtomValue(noLossTradeSizeAtom);
  const activeTournamentData = useAtomValue(activeTournamentDataReadOnlyAtom);
  const currentTime = useAtomValue(timeSelectorAtom);
  const activeChain = useAtomValue(activeChainAtom);
  const { writeCall } = useWriteCall();
  const settings = useAtomValue(tradeSettingsAtom);
  const [loadingState, setLoadingState] = useState<
    'up' | 'down' | 'approve' | 'none' | 'claim'
  >('none');
  const activeMarketData = useAtomValue(activeMarketDataAtom);
  const isIncreationWindow = useIsMarketInCreationWindow();
  let { sendTxn } = useSmartAccount();
  if (!activeChain)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        No Active Chain
      </BlueBtn>
    );
  if (!user || !user.userAddress)
    return (
      <ConnectionRequired>
        <></>
      </ConnectionRequired>
    );
  if (activeMarketData === undefined)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        No Active Market
      </BlueBtn>
    );
  const isOpen =
    !activeMarket.isPaused &&
    isIncreationWindow[
      activeMarket.chartData.category.toLowerCase() as
        | 'crypto'
        | 'forex'
        | 'commodity'
    ];
  if (isOpen === undefined) {
    return <Skeleton className="!h-[36px] full-width sr lc !transform-none" />;
  }
  if (!isOpen) {
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        Market is closed
      </BlueBtn>
    );
  }

  if (
    activeTournamentData === undefined ||
    activeTournamentData.data === undefined
  )
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        No Active Tournament
      </BlueBtn>
    );

  if (activeTournamentData.data?.state.toLowerCase() === 'closed') {
    async function handleClaim() {
      setLoadingState('claim');
      await writeCall(
        config.leaderboard,
        TournamentLeaderboardABI,
        (response) => {
          setLoadingState('none');
          console.log(response);
        },
        'claimReward',
        [activeTournamentData!.id]
      );
    }
    const alreadClaimed = activeTournamentData.data.hasUserClaimed;
    return (
      <BufferButton
        onClick={handleClaim}
        isLoading={loadingState === 'claim'}
        isDisabled={loadingState !== 'none' || alreadClaimed}
        className={'bg-blue'}
      >
        {alreadClaimed ? 'Already Claimed' : 'Claim'}
      </BufferButton>
    );
  }

  if (activeTournamentData.data?.state.toLowerCase() === 'upcoming') {
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        Tournament is not started yet.
      </BlueBtn>
    );
  }

  if (!activeMarket || !price)
    return <Skeleton className="!h-[36px] full-width sr lc !transform-none" />;

  const { isViewOnlyMode } = user;
  if (isViewOnlyMode)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        View Only Mode
      </BlueBtn>
    );

  if (readCallResults === undefined)
    return <Skeleton className="!h-[36px] full-width sr lc !transform-none" />;
  const { isTradingApproved } = readCallResults;
  if (isTradingApproved === undefined)
    return <Skeleton className="!h-[36px] full-width sr lc !transform-none" />;

  const config = getNoLossV3Config(activeChain.id);

  async function handleApproveClick(revoke: boolean) {
    try {
      setLoadingState('approve');
      await writeCall(
        config.manager,
        TournamentManagerABI,
        (response) => {
          console.log(response);
        },
        'setApprovalForAll',
        [config.router, !revoke]
      );
    } catch (e) {
      toastify({
        msg: 'Error while approving ' + (e as Error).message,
        type: 'error',
        id: 'approve-error-no-loss',
      });
    } finally {
      setLoadingState('none');
    }
  }

  if (isTradingApproved === false) {
    return (
      <BufferButton
        onClick={() => {
          handleApproveClick(false);
        }}
        isLoading={loadingState === 'approve'}
        className="bg-blue"
        isDisabled={loadingState !== 'none'}
      >
        Approve
      </BufferButton>
    );
  }

  async function buyTrade(isAbove: boolean) {
    try {
      const userBalance = readCallResults?.activeTournamentBalance;

      if (userBalance === undefined)
        throw new Error('User balance is undefined');
      const tradeSizeError = getTradeSizeError(
        divide(activeMarket.config.minFee, 18) as string,
        divide(activeMarket.config.maxFee, 18) as string,
        userBalance,
        userInput
      );
      if (tradeSizeError) throw new Error(tradeSizeError);

      const durationError = getDurationError(
        currentTime.HHMM,
        secondsToHHMM(+activeMarket.config.maxPeriod),
        secondsToHHMM(+activeMarket.config.minPeriod)
      );
      if (durationError) throw new Error(durationError);

      const slippageError = getSlippageError(settings.slippageTolerance);
      if (slippageError !== null) throw new Error(slippageError);

      if (activeTournamentData === undefined)
        throw new Error('No active tournament data found');

      if (activeTournamentData.data === undefined)
        throw new Error('No active tournament data found');

      const currentEpoch = Math.floor(Date.now() / 1000);
      if (
        currentEpoch + currentTime.seconds >
        +activeTournamentData.data?.tournamentMeta.close
      )
        throw new Error('Trade time exceeds tournament ending time');

      setLoadingState(isAbove ? 'up' : 'down');

      const args = [
        toFixed(multiply(userInput, 18), 0),
        currentTime.seconds,
        isAbove,
        activeMarket.address,
        toFixed(multiply(('' + price).toString(), 8), 0),
        toFixed(multiply(settings.slippageTolerance.toString(), 2), 0),
        0,
        activeTournamentData.id,
      ];
      const encodedFunctionData = encodeFunctionData({
        abi: RouterABI,
        functionName: 'initiateTrade',
        args,
      });
      const tx1 = {
        to: config.router,
        data: encodedFunctionData,
      };
      await sendTxn([tx1]);
    } catch (e) {
      toastify({
        msg: (e as Error).message,
        type: 'error',
        id: 'buy-error-no-loss',
      });
    } finally {
      setLoadingState('none');
    }
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <BufferButton
          onClick={() => buyTrade(true)}
          isLoading={loadingState === 'up'}
          isDisabled={loadingState !== 'none'}
          className={`bg-green`}
        >
          <UpIcon className="mr-[6px] scale-150" />
          Up
        </BufferButton>
        <BufferButton
          isLoading={loadingState === 'down'}
          className={`bg-red`}
          onClick={() => buyTrade(false)}
          isDisabled={loadingState !== 'none'}
        >
          <>
            <DownIcon className="mr-[6px] scale-150" />
            Down
          </>
        </BufferButton>
      </div>
      <div
        className="approve-btn-styles text-f12 text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto sm:text-f13 mt-3"
        role={'button'}
        onClick={() => {
          handleApproveClick(true);
        }}
      >
        Revoke Approval
      </div>
    </>
  );
};
