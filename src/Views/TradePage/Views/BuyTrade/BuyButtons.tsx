import { useToast } from '@Contexts/Toast';
import { useGasPriceCheck } from '@Hooks/useGasPrice';
import { priceAtom } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import DownIcon from '@SVG/Elements/DownIcon';
import MemoTimeIcon from '@SVG/Elements/TimeIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { getLastbar } from '@TV/useDataFeed';
import { isUSDCSelected } from '@TV/utils';
import { toFixed } from '@Utils/NumString';
import {
  add,
  divide,
  lt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { cn } from '@Utils/cn';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useBuyTradeActions } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useIsMarketOpen } from '@Views/TradePage/Hooks/useIsMarketOpen';
import { useLimitOrdersExpiry } from '@Views/TradePage/Hooks/useLimitOrdersExpiry';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import {
  activePoolObjAtom,
  limitOrderStrikeAtom,
  tradeTypeAtom,
} from '@Views/TradePage/atoms';
import getPayout, { getMultiplier } from '@Views/TradePage/utils/getPayout';
import { Skeleton } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useEffect } from 'react';
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
  const [{ activePool }, setActivePool] = useAtom(activePoolObjAtom);

  const { viewOnlyMode } = useUserAccount();
  const { isGasPriceHigh } = useGasPriceCheck();
  useEffect(() => {
    console.log(`isGasPriceHigh-c${isGasPriceHigh}`);
  }, [isGasPriceHigh]);
  const { data: sfs } = useSettlementFee();
  useEffect(() => {
    console.log(`sfs-c${sfs}`);
  }, [sfs]);

  console.log(`BuyButtons-sfs: `, sfs);
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
            <div className="flex  flex-col justify-center items-end gap-[4px]">
              <BlueBtn
                className="text-f13 text-1 text-center"
                isDisabled={true}
                onClick={() => {}}
              >
                <span>
                  {isUSDCSelected(activePool)
                    ? 'Trading is halted for USDC.e'
                    : 'Trading is halted for this asset'}
                </span>
              </BlueBtn>
            </div>
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
              {isGasPriceHigh ? (
                <div className="chip-styles-danger w-full text-[#eaeaea] mb-3">
                  Trade settlements delayed due to gas spike{' '}
                </div>
              ) : null}
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
                  className={` group relative  mb-3  text-1 bg-green hover:text-1 ${
                    center
                      ? tradeType != 'Limit'
                        ? 'min-h-full'
                        : '!h-fit  !min-h-[30px]'
                      : ''
                  }`}
                >
                  <DisplayPayout
                    className={
                      'absolute top-[102%] left-[50%] -translate-x-1/2'
                    }
                    settlementFee={sfs?.up.settlement_fee}
                    amount={amount}
                  />
                  {center && tradeType == 'Limit' ? (
                    <div className="flex justify-between items-center w-full px-[13px] py-[3px] pt-[2px] ">
                      <div className="flex-col flex items-start">
                        <span className="text-f14 font-bold  flex mb-[-2px]">
                          Up
                          <DisplaySF settlementFee={sfs?.down.settlement_fee} />
                        </span>
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
                      <DisplaySF settlementFee={sfs?.up.settlement_fee} />
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
                  className={`group relative mb-3 text-1 bg-red ${
                    center
                      ? tradeType != 'Limit'
                        ? 'min-h-full'
                        : '!h-fit !min-h-[30px]'
                      : ''
                  }`}
                  onClick={() => buyTrade(false)}
                >
                  <DisplayPayout
                    className={
                      'absolute top-[102%] left-[50%] text-red -translate-x-1/2'
                    }
                    settlementFee={sfs?.down.settlement_fee}
                    amount={amount}
                  />

                  {center && tradeType == 'Limit' ? (
                    <div className="flex  relative justify-between items-center w-full px-[13px] py-[3px] pt-[2px] flex-row-reverse ">
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
                      <DisplaySF settlementFee={sfs?.down.settlement_fee} />
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

export const DisplaySF = ({ settlementFee }) => {
  if (!settlementFee) return null;
  return (
    <div className=" group-hover:text-1 group-hover:font-semibold text-[#e0e0e0] text-f10  ml-[2px] mt-[2px]">
      ({getMultiplier(settlementFee)[1]})
    </div>
  );
};
export const DisplayPayout = ({ settlementFee, amount, className }) => {
  if (!settlementFee) return null;
  let totalPayout = getPayout(settlementFee);

  totalPayout = totalPayout ? divide(add(totalPayout, '100'), '100') : '0';

  const payoutwillbe = multiply(totalPayout, amount);
  const pnl = toFixed(subtract(payoutwillbe, amount), 2);

  if (!settlementFee) return null;
  return (
    <div
      className={cn(
        ' group-hover:scale-110 transition-transform text-green font-bold text-[8px]',
        className
      )}
    >
      +{pnl} USDC
    </div>
  );
};