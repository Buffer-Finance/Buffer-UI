import { Skeleton, duration } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import DownIcon from 'src/SVG/Elements/DownIcon';
import UpIcon from 'src/SVG/Elements/UpIcon';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import {
  add,
  divide,
  getPosInf,
  gt,
  lt,
  multiply,
  toFixed,
} from '@Utils/NumString/stringArithmatics';
import AccountInfo from '@Views/Common/AccountInfo';
import { Display } from '@Views/Common/Tooltips/Display';
import { QuickTradeExpiry, ammountAtom, approveModalAtom } from '../PGDrawer';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { priceAtom } from '@Hooks/usePrice';

import { ApproveModal } from '../Components/approveModal';
import { BuyUSDCLink } from './BuyUsdcLink';
import { AmountSelector, TimeSelector, timeToMins } from './TimeSelector';
import { useBinaryActions } from '../Hooks/useBinaryActions';
import { useQTinfo } from '..';
import { SettingsIcon } from './SettingsIcon';
import { SlippageModal } from '../Components/SlippageModal';
import YellowWarning from '@SVG/Elements/YellowWarning';
import { DurationPicker, DynamicDurationPicker } from './DurationPicker';
import { knowTillAtom } from '../Hooks/useIsMerketOpen';
import { useActivePoolObj } from './PoolDropDown';
import { useUserAccount } from '@Hooks/useUserAccount';
import { MarketTimingWarning } from '../MarketTimingWarning';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { useTradePolOrBlpPool } from '../Hooks/useTradePolOrBlpPool';
import { MarketInterface } from 'src/MultiChart';
import { OptionBuyintMarketState } from '@Views/NoLoss/NoLossOptionBuying';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import { erc20ABI } from 'wagmi';

export const ForexTimingsModalAtom = atom<boolean>(false);

// things we pass dynamically
// TODO pass balance, allowance, maxTrade, minTrade
// TODO OptionBuying Machanism
// TODO remove useBinaryActions
// TODO stats machanism
export function DynamicCustomOption({
  markets,
  data,
  tradeToken,
  buyHandler,
  handleApprove,
  routerContract,
}: {
  data?: OptionBuyintMarketState;
  markets: { [a: string]: MarketInterface };
  tradeToken: {
    address: string;
    name: string;
    decimal: number;
  };
  handleApprove: (a?: number) => void;
  buyHandler: (
    amount: string,
    isUp: boolean,
    duration: string,
    price: string
  ) => void;
  routerContract: string;
}) {
  if (!data?.activeMarket) return <></>;
  const allowance = data?.allowance;
  const [amount, setAmount] = useAtom(ammountAtom);
  const [currentTime, setCurrentTime] = useAtom(QuickTradeExpiry);

  const isAssetActive = !data?.activeMarket.isPaused;
  const tradeTokenDecimals = tradeToken.decimal;
  const balance = data?.balance;

  const marketPrice = useAtomValue(priceAtom);
  const activeAsset = data?.activeMarket;
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);

  const tradeTokenName = tradeToken.name;
  const min_amount = data?.minFee;
  if (!activeAsset) return null;
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeAsset);
  const currStats = {
    max_loss: '12',
    max_payout: '12',
  };
  const maxTrade = data?.maxFee;

  if (!data?.maxFee) {
    console.log(`DynamicCustomOption-maxTrade: `, maxTrade);
    return 'Loading...';
  }

  console.log(
    `DynamicCustomOption-add('1', divide('100', data.payout.total)): `,
    data.payout.total,
    divide(data.payout.total, '100')
  );

  return (
    <>
      <SlippageModal
        {...{
          isOpen: isSlippageModalOpen,
          clickHandler: console.log,
          closeModal: () => setIsSlippageModalOpen(false),
          loading: false,
          balance,
          onResetLayout: console.log,
        }}
      />

      <div className="custom-wrapper gap-y-3 mt-3">
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
            max_duration: '04:04',
            min_duration: '00:05',
          }}
        />
        <div className="flex-sbw items-center text-f14 ">
          Trade Size
          <MaxSizeComponent
            maxSize={maxTrade}
            unit={tradeToken.name}
            userInput={amount}
          />
        </div>
        <AmountSelector
          currentTime={amount}
          setTime={setAmount}
          max={maxTrade}
          balance={divide(balance, tradeTokenDecimals)}
          title="Investment"
          label="$"
          error={{
            min: min_amount,
            minMsg:
              "Can't trade less than " + min_amount + ' ' + tradeTokenName,
            max: balance == null ? 1e44 : +divide(balance, tradeTokenDecimals),
            maxMsg: (
              <div className="flex-center">
                You don't have enough {tradeTokenName}.&nbsp;
                <BuyUSDCLink token={tradeTokenName} />
              </div>
            ),
          }}
        />{' '}
        <div className="flex flex-col items-start text-f14 ">
          <AccountInfo
            shouldDisplayString
            unit={tradeTokenName}
            balance={divide(balance, tradeTokenDecimals)}
          />
        </div>
        {/* TODO at 180, marketPrice?.[activeAsset.tv_id]?.close always return false, since marketPrice?.[activeAsset.tv_id] is an array */}
        {amount && data.payout.total ? (
          <div className="flex-sbw text-f14 my-3 ">
            <div className="text-f12 w-full items-start flex-col flex-start flex wrap text-2">
              <span className="nowrap">
                {' '}
                Payout
                {data.payout.boosted &&
                  gt(data.payout.boosted, '0') &&
                  '(' + data.payout.boosted + '% Boosted)'}
                &nbsp;;
              </span>
              <Display
                className="text-1 text-f16"
                data={multiply(add('1', divide(data.payout.total, 2)), amount)}
                unit={tradeTokenName}
              />
            </div>
            <div className="text-f12  w-[90%] items-start flex-col flex-start wrap flex text-2">
              Profit :&nbsp;
              <Display
                className=" text-f16 text-green"
                data={currStats.max_payout - currStats.max_loss}
                unit={tradeTokenName}
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
              {allowance == '0' ? (
                <BlueBtn onClick={() => handleApprove()}>Approve</BlueBtn>
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
                      onClick={() =>
                        buyHandler(
                          amount,
                          true,
                          timeToMins(currentTime),
                          activeAssetPrice
                        )
                      }
                      isLoading={false}
                      className=" text-1 bg-green hover:text-1"
                    >
                      <>
                        <UpIcon className="mr-[6px] scale-150" />
                        Up
                      </>
                    </GreenBtn>
                    <RedBtn
                      isLoading={false}
                      className=" text-1 bg-red "
                      onClick={() =>
                        buyHandler(
                          amount,
                          false,
                          timeToMins(currentTime),
                          activeAssetPrice
                        )
                      }
                    >
                      <>
                        <DownIcon className="mr-[6px] scale-150" />
                        Down
                      </>
                    </RedBtn>
                  </div>
                </>
              )}
            </span>
          </ConnectionRequired>
        }
      </div>
    </>
  );
}

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
