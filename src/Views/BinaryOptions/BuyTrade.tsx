import { useActiveChain } from '@Hooks/useActiveChain';
import { priceAtom, usePrice } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import { Skeleton } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import DownIcon, { DownIconWhite } from '@SVG/Elements/DownIcon';
import UpIcon, { UpIconWhite } from '@SVG/Elements/UpIcon';
import { getPriceFromKlines, marketPriceAtom } from '@TV/useDataFeed';
import { divide, lt } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { useAtom, useAtomValue } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import { useQTinfo } from '.';
import { AmountSelector, DurationSelector } from './AmountSelector';
import { ShareModal } from './Components/shareModal';
import { useBinaryActions } from './Hooks/useBinaryActions';
import { knowTillAtom } from './Hooks/useIsMerketOpen';
import { MarketTimingWarning } from './MarketTimingWarning';
import { ammountAtom, approveModalAtom } from './PGDrawer';
import { DurationPicker } from './PGDrawer/DurationPicker';
import { useActivePoolObj } from './PGDrawer/PoolDropDown';

const BuyTrade: React.FC<any> = ({}) => {
  const [amount, setAmount] = useAtom(ammountAtom);

  const { address: account } = useUserAccount();
  const { openConnectModal } = useConnectModal();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const {
    handleApproveClick,
    buyHandler,
    loading,
    currStats,
    activeAssetState,
  } = useBinaryActions(amount, true, true);

  const [balance, allowanceWei, maxTrade, _, routerPermission] =
    activeAssetState;

  const UpHandler = () => {
    if (!account) return openConnectModal?.();
    if (lt(allowance || '0', amount.toString() || '0'))
      return setIsApproveModalOpen(true);
    buyHandler({ is_up: true });
  };

  const DownHandler = () => {
    if (!account) return openConnectModal?.();
    if (lt(allowance || '0', amount.toString() || '0'))
      return setIsApproveModalOpen(true);
    buyHandler({ is_up: false });
  };

  useEffect(() => {
    if (isApproveModalOpen && account) {
      setIsApproveModalOpen(false);
    }
  }, [account]);
  usePrice();
  const knowTill = useAtomValue(knowTillAtom);
  const qtInfo = useQTinfo();
  const marketPrice = useAtomValue(priceAtom);
  const activeAsset = qtInfo?.activePair;
  const { activePoolObj } = useActivePoolObj();
  const isForex = activeAsset.category === 'Forex';
  // useIsMarketOpen();
  const isMarketOpen = knowTill.open && isForex;
  const allowance = divide(allowanceWei?.[0], activePoolObj.token.decimals);
  const isAssetActive =
    routerPermission &&
    routerPermission[activeAsset.pools[0].options_contracts.current];
  // const [rpcState] = useRPCchecker();
  if (!activeAsset) return null;
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeAsset);
  console.log(
    `activeAssetPrice: `,
    activeAssetPrice,
    marketPrice,
    activeAsset,
    allowance
  );
  let MarketOpenWarning: ReactNode | null = null;
  if (activeAsset.category == 'Forex') {
    MarketOpenWarning = <MarketTimingWarning />;
  }
  usePrice();
  return (
    <div>
      <div className="flex gap-3 my-3">
        <AmountSelector {...{ amount, setAmount, activeAssetState }} />
        <DurationSelector />
      </div>
      {(currStats && currStats.max_loss && currStats.max_payout) ||
      (activeAssetPrice && currStats?.max_payout) ? (
        <div className="flex-sbw text-f14 my-3 ">
          <div className="f14  flex-start flex wrap text-2">
            Payout :&nbsp;
            <Display
              className="text-1"
              data={currStats.max_payout.toString()}
              unit={activePoolObj.token.name}
            />
          </div>
          <div className="f14 flex-start wrap flex text-2">
            Profit :&nbsp;
            <Display
              className="text-1"
              data={currStats.max_payout - currStats.max_loss}
              unit={activePoolObj.token.name}
            />{' '}
          </div>
        </div>
      ) : (
        <Skeleton
          className="custom-h full-width sr lc mb3"
          variant="rectangular"
        />
      )}
      {
        <ConnectionRequired>
          <span>
            {allowance == null || !activeAssetPrice ? (
              <Skeleton className="h4 full-width sr lc mb3" />
            ) : lt(allowance, amount.toString() || '0') ? (
              <BlueBtn
                onClick={() => {
                  account ? setIsApproveModalOpen(true) : openConnectModal?.();
                }}
              >
                Approve
              </BlueBtn>
            ) : !isAssetActive ? (
              <BlueBtn
                className="text-f13 text-1 text-center"
                isDisabled={true}
                onClick={() => {}}
              >
                Trading is halted for this asset
              </BlueBtn>
            ) : (
              <>
                <div className="flex gap-2">
                  <GreenBtn
                    onClick={UpHandler}
                    isDisabled={isForex && !isMarketOpen}
                    isLoading={
                      loading &&
                      typeof loading !== 'number' &&
                      loading?.is_up === true
                    }
                    className="bg-green text-1  hover:brightness-125 !text-f20 !font-bold"
                  >
                    <>
                      <UpIconWhite className={'mr-[10px]'} />
                      Up
                    </>
                  </GreenBtn>
                  <RedBtn
                    isDisabled={isForex && !isMarketOpen}
                    isLoading={
                      loading &&
                      typeof loading !== 'number' &&
                      loading?.is_up === false
                    }
                    onClick={DownHandler}
                    className="!bg-red !text-1  hover:brightness-125 !text-f20 !font-bold"
                  >
                    <>
                      <DownIconWhite className={'mr-[10px]'} />
                      Down
                    </>
                  </RedBtn>
                </div>
                <div
                  className=" text-f13 mt-1 underline text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto"
                  role={'button'}
                  onClick={() =>
                    !account ? openConnectModal?.() : handleApproveClick('0')
                  }
                >
                  Revoke Approval
                </div>
              </>
            )}
          </span>
        </ConnectionRequired>
      }
    </div>
  );
};

export { BuyTrade };
