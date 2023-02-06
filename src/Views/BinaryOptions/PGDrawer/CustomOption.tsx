import { Skeleton } from '@mui/material';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { atom, useAtom, useAtomValue } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import DownIcon from 'src/SVG/Elements/DownIcon';
import UpIcon from 'src/SVG/Elements/UpIcon';
import {
  getPriceFromKlines,
  marketPriceAtom,
} from 'src/TradingView/useDataFeed';
import { divide, gt, lt, multiply } from '@Utils/NumString/stringArithmatics';
import AccountInfo from '@Views/Common/AccountInfo';
import { Display } from '@Views/Common/Tooltips/Display';
import { ammountAtom, approveModalAtom } from '../PGDrawer';
import { ApproveModal } from '../Components/approveModal';
import { BuyUSDCLink } from './BuyUsdcLink';
import { TimeSelector } from './TimeSelector';
import { useBinaryActions } from '../Hooks/useBinaryActions';
import { useNetwork } from 'wagmi';
import { useQTinfo } from '..';
import { SettingsIcon } from './SettingsIcon';
import { SlippageModal } from '../Components/SlippageModal';
import YellowWarning from '@SVG/Elements/YellowWarning';
import { DurationPicker } from './DurationPicker';
import { knowTillAtom } from '../Hooks/useIsMerketOpen';
import { useActivePoolObj } from './PoolDropDown';
import { useUserAccount } from '@Hooks/useUserAccount';
import { MarketTimingWarning } from '../MarketTimingWarning';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getChains } from 'src/Config/wagmiClient';
import {  useConnectModal} from '@rainbow-me/rainbowkit'
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';

export const ForexTimingsModalAtom = atom<boolean>(false);

export function CustomOption() {
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

  const [balance, allowanceWei, maxTrade] = activeAssetState;
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
  const knowTill = useAtomValue(knowTillAtom);
  const { chain } = useNetwork();
  const chains = getChains();
  const { activeChain } = useActiveChain();
  const activeChainName = activeChain?.name;
  const qtInfo = useQTinfo();
  const [marketPrice] = useAtom(marketPriceAtom);
  const activeAsset = qtInfo?.activePair;
  const [isOpen, setIsOpen] = useState(false);
  const { activePoolObj } = useActivePoolObj();
  const isForex = activeAsset.category === 'Forex';
  // useIsMarketOpen();
  const isMarketOpen = knowTill.open && isForex;
  const allowance = divide(allowanceWei, activePoolObj.token.decimals);
  // const [rpcState] = useRPCchecker();
  if (!activeAsset) return null;
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeAsset);
  let MarketOpenWarning: ReactNode | null = null;
  if (activeAsset.category == 'Forex') {
    MarketOpenWarning = <MarketTimingWarning />;
  }
  return (
    <>
      <SlippageModal
        {...{
          isOpen,
          clickHandler: console.log,
          closeModal: () => setIsOpen(false),
          loading: false,
        }}
      />
      <ApproveModal
        token={activePoolObj.token.name}
        clickHandler={(isChecked) => {
          handleApproveClick(
            !isChecked
              ? multiply(amount, activePoolObj.token.decimals)
              : undefined
          );
        }}
        isOpen={isApproveModalOpen}
        closeModal={() => setIsApproveModalOpen(false)}
        loading={loading as number}
      />

      <div className="custom-wrapper gap-y-3">
        <div className="text-f14 flex-sbw items-center">
          <div className="text-f14">Select Duration</div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 underline underline-offset-2 hover:brightness-125"
          >
            Advanced
            <div className="!p-[5px] !bg-1 hover:brightness-125 sr">
              <SettingsIcon />
            </div>
          </button>
        </div>
        <DurationPicker />
        <div className="flex-sbw items-center text-f14 ">
          Trade Size
          <MaxSizeComponent
            maxSize={maxTrade}
            unit={activePoolObj.token.name}
            userInput={amount}
          />
        </div>
        <TimeSelector
          currentTime={amount}
          setTime={setAmount}
          investmentDD
          max={maxTrade}
          title="Investment"
          label="$"
          error={{
            min: 1,
            minMsg: "Can't invest less than 1 " + activePoolObj.token.name,
            max:
              balance == null
                ? 1e44
                : +divide(balance, activePoolObj.token.decimals),
            maxMsg: (
              <div className="flex-center">
                You don't have enough {activePoolObj.token.name}.&nbsp;
                <BuyUSDCLink token={activePoolObj.token.name} />
              </div>
            ),
          }}
        />{' '}
        <div className="flex-sbw flex-col items-start text-f14 ">
          <AccountInfo
            shouldDisplayString
            unit={activePoolObj.token.name}
            balance={divide(balance, activePoolObj.token.decimals)}
          />
        </div>
        {/* TODO at 180, marketPrice?.[activeAsset.tv_id]?.close always return false, since marketPrice?.[activeAsset.tv_id] is an array */}
        {(currStats && currStats.max_loss && currStats.max_payout) ||
        (marketPrice?.[activeAsset.tv_id]?.close && currStats?.max_payout) ? (
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
        ) : (
          <>
            <div className="btn-wrapper">
              <GreenBtn
                onClick={UpHandler}
                isDisabled={isForex && !isMarketOpen}
                isLoading={
                  loading &&
                  typeof loading !== 'number' &&
                  loading?.is_up === true
                }
                className="bg-cross-bg text-green hover:bg-green hover:text-1"
                >
                <>
                  <UpIcon className="mr-[6px] scale-150" />
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
                >
                <>
                  <DownIcon className="mr-[6px] scale-150" />
                  Down
                </>
              </RedBtn>
            </div>
            <div
              className="approve-btn-styles text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto"
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

        {MarketOpenWarning}
      </div>
    </>
  );
}

const MaxSizeComponent = ({
  maxSize,
  unit,
  userInput,
}: {
  maxSize: string;
  unit: string;
  userInput: string;
}) => {
  const isMaxCrossed = maxSize && gt(userInput || '0', maxSize);
  return (
    <div className="flex items-center text-3 flex-wrap text-f13">
      {isMaxCrossed && (
        <YellowWarning
          tooltip={
            isMaxCrossed
              ? `Insufficient funds in the ${unit.toUpperCase()} pool`
              : ''
          }
        />
      )}
      &nbsp;&nbsp;
      <span className="whitespace-nowrap"> Max :</span>
      {maxSize ? (
        <Display
          data={maxSize}
          unit={unit}
          className="ml-2 whitespace-nowrap"
        />
      ) : (
        '-'
      )}
    </div>
  );
};
