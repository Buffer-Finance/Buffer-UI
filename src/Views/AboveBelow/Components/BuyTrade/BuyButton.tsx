import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { toFixed } from '@Utils/NumString';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { useIsInCreationWindow } from '@Views/AboveBelow/Hooks/useIsInCreationWIndow';
import { useMaxTrade } from '@Views/AboveBelow/Hooks/useMaxTrade';
import {
  readCallDataAtom,
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { Skeleton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { getAddress } from 'viem';
import RouterABI from '../../abis/Router.json';
import { ApproveBtn } from './ApproveBtn';
import { getTradeSizeError } from './TradeSize';
export const Buy = () => {
  const isIncreationWindow = useIsInCreationWindow();
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);

  if (activeMarket === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Market
        </BlueBtn>
      </ConnectionRequired>
    );

  const isOpen =
    !activeMarket.isPaused &&
    isIncreationWindow[
      activeMarket.category.toLowerCase() as 'crypto' | 'forex' | 'commodity'
    ];

  if (!isOpen) {
    return (
      <BlueBtn onClick={() => {}} isDisabled={true}>
        Market is closed
      </BlueBtn>
    );
  }

  return <TradeButton />;
};

const TradeButton = () => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const { writeCall } = useWriteCall(config.above_below_router, RouterABI);
  const toastify = useToast();
  const [loading, setLoading] = useState<'Up' | 'Down' | 'approve' | 'None'>(
    'None'
  );
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const [settings] = useAtom(tradeSettingsAtom);
  const amount = useAtomValue(tradeSizeAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const readCallData = useAtomValue(readCallDataAtom);
  const referralData = useReferralCode();
  const { data: tradeSizes } = useMaxTrade({
    activeMarket,
    expiry: selectedTimestamp,
  });
  const { currentPrice } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });

  if (activeMarket === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Market
        </BlueBtn>
      </ConnectionRequired>
    );

  if (readCallData === undefined)
    return <Skeleton className="!h-[36px] full-width sr lc !transform-none" />;
  const token = activeMarket.poolInfo.token.toUpperCase();
  const decimals = activeMarket.poolInfo.decimals;
  const allowance = divide(readCallData.allowances[token], decimals);

  if (allowance === undefined || allowance === null)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Allowance not found{' '}
        </BlueBtn>
      </ConnectionRequired>
    );

  if (lt(allowance, amount || '0')) {
    return (
      <ApproveBtn
        tokenAddress={activeMarket.poolInfo.tokenAddress}
        routerAddress={config.above_below_router}
      />
    );
  }
  async function buyTrade(isAbove: boolean) {
    try {
      if (!selectedTimestamp) throw new Error('Please select expiry date');
      if (!readCallData) throw new Error('Error fetching data');
      if (!activeMarket) throw new Error('active market not found');
      if (!currentPrice) throw new Error('current price not found');
      if (!tradeSizes) throw new Error('trade size not found');
      if (!amount) throw new Error('Enter a positive amount');
      const tradesizeError = getTradeSizeError(
        divide(
          tradeSizes[
            getAddress(activeMarket.address) + '-' + selectedTimestamp / 1000
          ],
          activeMarket.poolInfo.decimals
        ) as string,
        divide(readCallData.balances[token], decimals) ?? ('0' as string),
        amount
      );
      if (tradesizeError) throw new Error(tradesizeError);
      setLoading(isAbove ? 'Up' : 'Down');
      await writeCall(
        (res) => {
          if (res) {
            const content = (
              <div className="flex flex-col gap-y-2 text-f12 ">
                <div className="nowrap font-[600]">
                  Trade placed
                  {/* at Strike : {toFixed(divide(baseArgs[ArgIndex.Strike], 8), 3)} */}
                </div>
                <div className="flex items-center">
                  {activeMarket.token0 + '-' + activeMarket.token1}&nbsp;&nbsp;
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
                    {amount}&nbsp;{activeMarket.poolInfo.token.toUpperCase()}
                  </span>
                </div>
              </div>
            );
            toastify({
              type: 'success',
              timings: 20,
              body: null,
              msg: content,
            });
          }
        },
        'initiateTrade',
        [
          [
            activeMarket.address,
            settings.partialFill,
            isAbove,
            selectedTimestamp / 1000,
            toFixed(multiply(amount, decimals), 0),
            referralData[2],
          ],
        ]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'buyTrade-above-below',
      });
    } finally {
      setLoading('None');
    }
  }

  return (
    <ConnectionRequired>
      <div className="flex gap-2 items-center">
        <BufferButton
          onClick={() => buyTrade(true)}
          isDisabled={loading !== 'None'}
          isLoading={loading === 'Up'}
          test-id="last-up-btn"
          className={` text-1 bg-green hover:text-1`}
        >
          <>
            <UpIcon className="mr-[6px] scale-150" />
            <span>Up</span>
          </>
        </BufferButton>
        <BufferButton
          isDisabled={loading !== 'None'}
          isLoading={loading === 'Down'}
          className={` text-1 bg-red`}
          onClick={() => buyTrade(false)}
        >
          <>
            <DownIcon className="mr-[6px] scale-150" />
            <span>Down</span>
          </>
        </BufferButton>
      </div>
    </ConnectionRequired>
  );
};
