import { useToast } from '@Contexts/Toast';
import { priceAtom } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import DownIcon from '@SVG/Elements/DownIcon';
import MemoTimeIcon from '@SVG/Elements/TimeIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { getLastbar } from '@TV/useDataFeed';
import { lt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useBuyTradeActions } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useIsMarketOpen } from '@Views/TradePage/Hooks/useIsMarketOpen';
import { useLimitOrdersExpiry } from '@Views/TradePage/Hooks/useLimitOrdersExpiry';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { limitOrderStrikeAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
import { Skeleton } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAtomValue, useSetAtom } from 'jotai';
import { ReactNode } from 'react';
import { useAccount } from 'wagmi';

export const BuyButtons = ({
  allowance,
  amount,
  center,
  isApprovalLocked,
}: {
  allowance: string;
  amount: string;
  center?: ReactNode;
  isApprovalLocked: boolean | undefined;
}) => {
  const marketPrice = useAtomValue(priceAtom);

  const { activeMarket } = useActiveMarket();
  const activeAssetPrice = getLastbar(marketPrice, {
    tv_id: activeMarket.tv_id,
  });
  // const activeAssetPrice = useCurrentPrice({
  //   token0: activeMarket.token0,
  //   token1: activeMarket.token1,
  // });
  const { registeredOneCT } = useOneCTWallet();
  const { address: account } = useAccount();
  // const { poolDetails } = useSwitchPool();
  const { openConnectModal } = useConnectModal();
  // const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { handleApproveClick, buyHandler, loading, revokeApproveClick } =
    useBuyTradeActions(amount);
  const expiry = useLimitOrdersExpiry();
  const { switchPool } = useSwitchPool();

  const setOneCTModal = useSetAtom(isOneCTModalOpenAtom);
  const toastify = useToast();
  const tradeType = useAtomValue(tradeTypeAtom);
  const limitStrike = useAtomValue(limitOrderStrikeAtom);
  const { isMarketOpen: isAssetActive, isForex } = useIsMarketOpen(
    activeMarket,
    switchPool?.pool,
    switchPool?.optionContract
  );
  const { viewOnlyMode } = useUserAccount();

  const buyTrade = (isUp?: boolean) => {
    if (!account) return openConnectModal?.();
    if (activeAssetPrice == null)
      return toastify({
        type: 'error',
        msg: 'Price not found',
        id: 'lo no strike',
      });

    // if (lt(allowance || '0', amount.toString() || '0'))
    //   return setIsApproveModalOpen(true);
    let strike = activeAssetPrice.price;
    let limitOrderExpiry = '0';
    if (tradeType == 'Limit') {
      if (!limitStrike)
        return toastify({
          type: 'error',
          msg: 'Please select a strike price',
          id: 'lo no strike',
        });
      limitOrderExpiry = expiry ?? '0';
      // console.log(`BuyButtons-limitOrderExpiry: `, limitOrderExpiry);
      strike = limitStrike;
    }
    buyHandler({
      is_up: isUp ? true : false,
      strike,
      limitOrderExpiry: Number(limitOrderExpiry),
      strikeTimestamp: activeAssetPrice.time,
    });
  };

  console.log(`BuyButtons-allowance: `, allowance, activeAssetPrice);
  if (viewOnlyMode)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        View Only Mode
      </BlueBtn>
    );
  return (
    <>
      {/* <ApproveModal
        token={poolDetails.token}
        clickHandler={(isChecked) => {
          handleApproveClick(
            !isChecked ? multiply(amount, poolDetails.decimals) : undefined
          );
        }}
        isOpen={isApproveModalOpen}
        closeModal={() => setIsApproveModalOpen(false)}
        loading={loading as number}
      /> */}
      <ConnectionRequired>
        <span>
          {allowance == null || !activeAssetPrice ? (
            <Skeleton className="h4 full-width sr lc mb3" />
          ) : !isAssetActive ? (
            <BlueBtn
              className="text-f13 text-1 text-center"
              isDisabled={true}
              onClick={() => {}}
            >
              <span>Trading is halted for this asset</span>
            </BlueBtn>
          ) : !registeredOneCT ? (
            <BlueBtn onClick={() => setOneCTModal(true)}>
              <span>Activate Account</span>
            </BlueBtn>
          ) : lt(allowance, amount.toString() || '0') ? (
            <BlueBtn onClick={() => handleApproveClick()}>
              <span>Approve</span>
            </BlueBtn>
          ) : (
            <>
              <div className="flex gap-2 items-center">
                <BufferButton
                  onClick={() => buyTrade(true)}
                  isDisabled={isForex && !isAssetActive}
                  isLoading={
                    !!loading &&
                    typeof loading !== 'number' &&
                    loading?.is_up === true
                  }
                  test-id="last-up-btn"
                  className={` text-1 bg-green hover:text-1 ${
                    center
                      ? tradeType != 'Limit'
                        ? 'min-h-full'
                        : '!h-fit  !min-h-[30px]'
                      : ''
                  }`}
                >
                  {center && tradeType == 'Limit' ? (
                    <div className="flex justify-between items-center w-full px-[13px] py-[3px] pt-[2px] ">
                      <div className="flex-col flex items-start">
                        <span className="text-f14 font-bold mb-[-2px]">Up</span>
                        <span className="text-f11">{limitStrike}</span>
                      </div>
                      <div>
                        <MemoTimeIcon />
                      </div>
                    </div>
                  ) : (
                    <>
                      <UpIcon className="mr-[6px] scale-150" />
                      <span>Up</span>
                    </>
                  )}
                </BufferButton>
                {center ? center : null}
                <BufferButton
                  isDisabled={isForex && !isAssetActive}
                  isLoading={
                    !!loading &&
                    typeof loading !== 'number' &&
                    loading?.is_up === false
                  }
                  className={` text-1 bg-red ${
                    center
                      ? tradeType != 'Limit'
                        ? 'min-h-full'
                        : '!h-fit !min-h-[30px]'
                      : ''
                  }`}
                  onClick={() => buyTrade(false)}
                >
                  {center && tradeType == 'Limit' ? (
                    <div className="flex justify-between items-center w-full px-[13px] py-[3px] pt-[2px] flex-row-reverse ">
                      <div className="flex-col flex items-end">
                        <span className="text-f14 font-bold mb-[-2px]">
                          Down
                        </span>
                        <span className="text-f11">{limitStrike}</span>
                      </div>
                      <div>
                        <MemoTimeIcon />
                      </div>
                    </div>
                  ) : (
                    <>
                      <DownIcon className="mr-[6px] scale-150" />
                      <span>Down</span>
                    </>
                  )}
                </BufferButton>
              </div>
              {/* {!isApprovalLocked && (
                <div
                  className="approve-btn-styles text-f12 text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto sm:text-f13 mt-3"
                  role={'button'}
                  onClick={() => revokeApproveClick()}
                >
                  <span>Revoke Approval</span>
                </div>
              )} */}
            </>
          )}
        </span>
      </ConnectionRequired>{' '}
    </>
  );
};
