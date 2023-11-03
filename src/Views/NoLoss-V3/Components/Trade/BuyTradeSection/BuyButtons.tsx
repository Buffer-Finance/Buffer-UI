import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import {
  activeChainAtom,
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
import TournamentManagerABI from '../../../ABIs/TournamentManager.json';
import { getDurationError } from './TimeSelector/TimePicker';
import { getTradeSizeError } from './TradeSizeSelector';

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
    'up' | 'down' | 'approve' | 'none'
  >('none');

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

  if (activeTournamentData === undefined)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        No Active Tournament
      </BlueBtn>
    );

  if (activeTournamentData.data?.state.toLowerCase() === 'closed') {
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        Tournament is ended.
      </BlueBtn>
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

      if (!activeTournamentData)
        throw new Error('No active tournament data found');

      setLoadingState(isAbove ? 'up' : 'down');
      await writeCall(
        config.router,
        RouterABI,
        (response) => {
          if (response !== undefined) {
            const content = (
              <div className="flex flex-col gap-y-2 text-f12 ">
                <div className="nowrap font-[600]">Trade order placed</div>
                <div className="flex items-center">
                  {activeMarket.chartData.token0 +
                    '-' +
                    activeMarket.chartData.token1}
                  &nbsp;&nbsp;
                  <span className="!text-3">to go</span>&nbsp;
                  {isAbove ? (
                    <>
                      <UpIcon className="text-green scale-125" /> &nbsp;Higher
                    </>
                  ) : (
                    <>
                      <DownIcon className="text-red scale-125" />
                      &nbsp; Lower
                    </>
                  )}
                </div>
                <div>
                  <span>
                    <span className="!text-3">Total amount:</span>
                    {userInput}&nbsp;
                  </span>
                </div>
              </div>
            );
            toastify({
              price,
              type: 'success',
              timings: 20,
              body: null,
              msg: content,
            });
          }
          console.log(response);
        },
        'initiateTrade',
        [
          toFixed(multiply(userInput, 18), 0),
          currentTime.seconds,
          isAbove,
          activeMarket.address,
          toFixed(multiply(('' + price).toString(), 8), 0),
          toFixed(multiply(settings.slippageTolerance.toString(), 2), 0),
          0,
          activeTournamentData.id,
        ]
      );
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
