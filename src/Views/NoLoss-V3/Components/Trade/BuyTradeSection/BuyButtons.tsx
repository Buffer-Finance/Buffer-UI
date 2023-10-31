import { useToast } from '@Contexts/Toast';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { lt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { useMarketPrice } from '@Views/NoLoss-V3/Hooks/useMarketPrice';
import {
  activeMarketDataAtom,
  activeTournamentDataReadOnlyAtom,
  noLossTradeSizeAtom,
  userAtom,
} from '@Views/NoLoss-V3/atoms';
import { useBuyTradeActions } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';

export const BuyButtons = () => {
  const { handleApproveClick, buyHandler, loading, revokeApproveClick } =
    useBuyTradeActions();
  const toastify = useToast();
  const activeMarket = useAtomValue(activeMarketDataAtom);
  const { price } = useMarketPrice(activeMarket?.chartData.tv_id);
  const allowance = '15';
  const user = useAtomValue(userAtom);
  const userInput = useAtomValue(noLossTradeSizeAtom);
  const activeTournamentData = useAtomValue(activeTournamentDataReadOnlyAtom);

  if (!user)
    return (
      <ConnectionRequired>
        <></>
      </ConnectionRequired>
    );
  if (!activeTournamentData)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        No Active Tournament
      </BlueBtn>
    );

  if (activeTournamentData.data?.state.toLowerCase() === 'completed') {
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
    return <Skeleton className="h4 full-width sr lc mb3" />;

  const { isViewOnlyMode } = user;
  if (isViewOnlyMode)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        View Only Mode
      </BlueBtn>
    );

  if (lt(allowance, userInput || '0')) {
    return <BlueBtn onClick={() => handleApproveClick()}>Approve</BlueBtn>;
  }

  const buyTrade = (isUp?: boolean) => {
    // if (!account) return openConnectModal?.();
    // if (activeAssetPrice == null)
    //   return toastify({
    //     type: 'error',
    //     msg: 'Price not found',
    //     id: 'lo no strike',
    //   });
    // // if (lt(allowance || '0', amount.toString() || '0'))
    // //   return setIsApproveModalOpen(true);
    // let strike = activeAssetPrice.price;
    // let limitOrderExpiry = '0';
    // if (tradeType == 'Limit') {
    //   if (!limitStrike)
    //     return toastify({
    //       type: 'error',
    //       msg: 'Please select a strike price',
    //       id: 'lo no strike',
    //     });
    //   limitOrderExpiry = expiry ?? '0';
    //   // console.log(`BuyButtons-limitOrderExpiry: `, limitOrderExpiry);
    //   strike = limitStrike;
    // }
    // buyHandler({
    //   is_up: isUp ? true : false,
    //   strike,
    //   limitOrderExpiry: Number(limitOrderExpiry),
    //   strikeTimestamp: activeAssetPrice.time,
    // });
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <BufferButton
          onClick={() => buyTrade(true)}
          isLoading={
            !!loading && typeof loading !== 'number' && loading?.is_up === true
          }
          className={`bg-green`}
        >
          <UpIcon className="mr-[6px] scale-150" />
          Up
        </BufferButton>
        <BufferButton
          isLoading={
            !!loading && typeof loading !== 'number' && loading?.is_up === false
          }
          className={`bg-red`}
          onClick={() => buyTrade(false)}
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
        onClick={() => revokeApproveClick()}
      >
        Revoke Approval
      </div>
    </>
  );
};
