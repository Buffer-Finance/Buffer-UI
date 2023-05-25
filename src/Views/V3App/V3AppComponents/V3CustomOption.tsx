import { Skeleton } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { ReactNode, useState } from 'react';
import DownIcon from 'src/SVG/Elements/DownIcon';
import UpIcon from 'src/SVG/Elements/UpIcon';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import {
  add,
  divide,
  gt,
  lt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import AccountInfo from '@Views/Common/AccountInfo';
import { Display } from '@Views/Common/Tooltips/Display';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { priceAtom } from '@Hooks/usePrice';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { SettingsIcon } from '@Views/BinaryOptions/PGDrawer/SettingsIcon';
import YellowWarning from '@SVG/Elements/YellowWarning';
import { DynamicDurationPicker } from '@Views/BinaryOptions/PGDrawer/DurationPicker';
import { SlippageModal } from '@Views/BinaryOptions/Components/SlippageModal';
import { ammountAtom, approveModalAtom } from '@Views/BinaryOptions/PGDrawer';
import { useSwitchPoolForTrade } from '../Utils/useSwitchPoolForTrade';
import { AmountSelector } from '@Views/BinaryOptions/PGDrawer/TimeSelector';
import { BuyUSDCLink } from '@Views/BinaryOptions/PGDrawer/BuyUsdcLink';
import { useV3AppData } from '../Utils/useV3AppReadCalls';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useV3AppActiveMarket } from '../Utils/useV3AppActiveMarket';
import { AssetCategory } from '../useV3AppConfig';
import { joinStrings } from '../helperFns';
import { marketsForChart } from '../config';
import { ApproveModal } from '@Views/BinaryOptions/Components/approveModal';
import { knowTillAtom } from '@Views/BinaryOptions/Hooks/useIsMerketOpen';
import { MarketTimingWarning } from '@Views/BinaryOptions/MarketTimingWarning';
import { binaryOptionsAtom } from '@Views/BinaryOptions/PGDrawer/CustomOption';
import { useV3BinaryActions } from '../Utils/useV3BinaryActions';

export const ForexTimingsModalAtom = atom<boolean>(false);

export function V3CustomOption({
  onResetLayout,
}: {
  onResetLayout: () => void;
}) {
  const { switchPool, poolDetails } = useSwitchPoolForTrade();
  const { activeMarket } = useV3AppActiveMarket();
  const [amount, setAmount] = useAtom(ammountAtom);
  const [currentTime, setCurrentTime] = useAtom(binaryOptionsAtom);
  const readcallData = useV3AppData();
  const marketPrice = useAtomValue(priceAtom);
  const knowTill = useAtomValue(knowTillAtom);

  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);

  if (!switchPool || !poolDetails || !readcallData || !activeMarket)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[250px] lc !rounded-md mx-2 mt-3 "
      />
    );
  let MarketOpenWarning: ReactNode | null = null;
  const tradeToken = poolDetails.token;
  const decimals = poolDetails.decimals;
  const minFee = divide(switchPool.min_fee, decimals) as string;
  const maxFee = divide(switchPool.max_fee, decimals) as string;
  const balance = divide(readcallData.balance, decimals) as string;
  const allowance = divide(readcallData.allowance, decimals) as string;
  const totalPayout = readcallData.totalPayout;
  const basePayout = switchPool.base_settlement_fee;
  const boostedPayout = subtract(totalPayout, basePayout);
  const isForex = activeMarket.category === AssetCategory[0];
  const isMarketOpen = true;
  const marketId = joinStrings(activeMarket.token0, activeMarket.token1, '');
  const activeChartMarket =
    marketsForChart[marketId as keyof typeof marketsForChart];
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeChartMarket);
  if (isForex && knowTill === false) {
    MarketOpenWarning = <MarketTimingWarning />;
  }

  return (
    <>
      <SlippageModal
        {...{
          isOpen: isSlippageModalOpen,
          clickHandler: console.log,
          closeModal: () => setIsSlippageModalOpen(false),
          loading: false,
          onResetLayout,
        }}
      />
      <div className="custom-wrapper gap-y-3 mt-3 px-[10px]">
        <div className="text-f14 text-0 flex-sbw items-center">
          <div className="">Time</div>
          <button
            onClick={() => setIsSlippageModalOpen(true)}
            className="flex items-center gap-1   hover:brightness-125"
          >
            Advanced
            <div className=" hover:brightness-125 sr">
              <SettingsIcon />
            </div>
          </button>
        </div>
        <DynamicDurationPicker
          {...{
            currentTime,
            setCurrentTime,
            max_duration: switchPool.max_duration,
            min_duration: switchPool.min_duration,
            //TODO - v3 check this out
            onSelect: (duration) => console.log(duration),
          }}
        />
        <div className="flex-sbw items-center text-f14 mt-3">
          Trade Size
          <MaxSizeComponent
            maxSize={maxFee}
            unit={tradeToken}
            userInput={amount}
          />
        </div>
        <AmountSelector
          investmentDD
          currentTime={amount}
          setTime={setAmount}
          max={Number(maxFee)}
          //TODO - v3 fix this
          balance={balance}
          title="Investment"
          label="$"
          error={{
            min: Number(minFee),
            minMsg: "Can't trade less than " + minFee + ' ' + tradeToken,
            max: balance == null ? 1e44 : +balance,
            maxMsg: (
              <div className="flex-center">
                You don't have enough {tradeToken}.&nbsp;
                <BuyUSDCLink token={tradeToken} />
              </div>
            ),
          }}
        />
        <div className="flex flex-col items-start text-f14 ">
          <AccountInfo
            shouldDisplayString
            unit={tradeToken}
            balance={balance}
          />
        </div>
        {/* TODO at 180, marketPrice?.[activeAsset.tv_id]?.close always return false, since marketPrice?.[activeAsset.tv_id] is an array */}
        <PayoutProfit
          amount={amount}
          boostedPayout={boostedPayout}
          totalPayout={totalPayout}
          tradeToken={tradeToken}
        />

        <TradeButton
          allowance={allowance}
          amount={amount}
          isAssetActive={!switchPool.isPaused}
          activeAssetPrice={activeAssetPrice}
          isForex={isForex}
          isMarketOpen={isMarketOpen}
        />
      </div>
      {MarketOpenWarning}
    </>
  );
}

const TradeButton = ({
  allowance,
  activeAssetPrice,
  amount,
  isAssetActive,
  isForex,
  isMarketOpen,
}: {
  isForex: boolean;
  isMarketOpen: boolean;
  allowance: string;
  activeAssetPrice: string;
  amount: string;
  isAssetActive: boolean;
}) => {
  const { address: account } = useAccount();
  const { poolDetails } = useSwitchPoolForTrade();
  const { openConnectModal } = useConnectModal();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { handleApproveClick, buyHandler, loading } =
    useV3BinaryActions(amount);

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

  if (!poolDetails) return <>Error: Pool not found</>;

  return (
    <>
      <ApproveModal
        token={poolDetails.token}
        clickHandler={(isChecked) => {
          handleApproveClick(
            !isChecked ? multiply(amount, poolDetails.decimals) : undefined
          );
        }}
        isOpen={isApproveModalOpen}
        closeModal={() => setIsApproveModalOpen(false)}
        loading={loading as number}
      />
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
              <div className="btn-wrapper">
                <GreenBtn
                  onClick={UpHandler}
                  isDisabled={isForex && !isMarketOpen}
                  isLoading={
                    loading &&
                    typeof loading !== 'number' &&
                    loading?.is_up === true
                  }
                  className=" text-1 bg-green hover:text-1"
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
                  className=" text-1 bg-red "
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
      </ConnectionRequired>{' '}
    </>
  );
};

const PayoutProfit = ({
  amount,
  boostedPayout,
  totalPayout,
  tradeToken,
}: {
  amount: string;
  totalPayout: string;
  boostedPayout: string;
  tradeToken: string;
}) => {
  if (amount && totalPayout) {
    return (
      <div className="flex-sbw text-f14 my-3 mb-4">
        <div className="text-f12 w-full items-start flex-col flex-start flex wrap text-2">
          <span className="nowrap mb-1">
            {' '}
            Payout
            {boostedPayout &&
              gt(boostedPayout, '0') &&
              '(' + boostedPayout + '% Boosted)'}
            &nbsp;;
          </span>
          <Display
            className="text-1 text-f16"
            data={multiply(add('1', divide(totalPayout, 2)), amount)}
            unit={tradeToken}
          />
        </div>
        <div className="text-f12  w-[90%] items-start flex-col flex-start wrap flex text-2  gap-y-1">
          Profit :&nbsp;
          <Display
            className=" text-f16 text-green"
            data={subtract(
              multiply(add('1', divide(totalPayout, 2)), amount),
              amount
            )}
            unit={tradeToken}
          />{' '}
        </div>
      </div>
    );
  } else {
    return (
      <Skeleton
        className="custom-h full-width sr lc mb3"
        variant="rectangular"
      />
    );
  }
};

export const MaxSizeComponent = ({
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
      <span className="whitespace-nowrap"> Avail :</span>
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

export const SlippageButton = ({ onClick }: { onClick: (e: any) => void }) => {
  return (
    <button
      onClick={onclick}
      className="flex items-center gap-1   hover:brightness-125"
    >
      Advanced
      <div className=" hover:brightness-125 sr">
        <SettingsIcon />
      </div>
    </button>
  );
};
