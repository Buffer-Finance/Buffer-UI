import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { toFixed } from '@Utils/NumString';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { useIsInCreationWindow } from '@Views/AboveBelow/Hooks/useIsInCreationWIndow';
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
import RouterABI from '../../abis/Router.json';
import { ApproveBtn } from './ApproveBtn';
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
      // const strikes = strikePrices;
      // const activeAssetStrikes = strikes[activeMarket.tv_id];
      // if (!activeAssetStrikes)
      //   throw new Error('active asset strikes not found');
      // const iv = ivs?.[activeMarket.tv_id];
      // if (iv === undefined) throw new Error('iv not found');
      // const slippageError = getSlippageError(settings.slippageTolerance);
      // if (slippageError !== null) throw new Error(slippageError);
      // const priceObj = selectedPrice[activeMarket.tv_id];
      // if (!priceObj) throw new Error('price obj not found');
      // const price = priceObj.price;
      // let strikePriceObject = activeAssetStrikes.increasingPriceArray.find(
      //   (obj) => obj.strike.toString() == priceObj.price
      // );
      // if (!strikePriceObject) {
      //   strikePriceObject = activeAssetStrikes.decreasingPriceArray.find(
      //     (obj) => obj.strike.toString() == priceObj.price
      //   );
      // }
      // if (!strikePriceObject) throw new Error('Please select a strike price');
      // const totalFee = priceObj.isAbove
      //   ? strikePriceObject.totalFeeAbove
      //   : strikePriceObject.totalFeeBelow;
      // if (!totalFee) throw new Error('total fee not found');
      // const expiration = Math.floor(selectedTimestamp / 1000);

      // const balance =
      //   divide(readCallData.balances[token], decimals) ?? ('0' as string);

      // let maxTradeSize = MAX_APPROVAL_VALUE;
      // const maxPermissibleMarket =
      //   readCallData.maxPermissibleContracts[
      //     getAddress(activeMarket.address) + price
      //   ];
      // if (maxPermissibleMarket !== undefined) {
      //   const maxPermissibleContracts =
      //     maxPermissibleMarket.maxPermissibleContracts;
      //   if (maxPermissibleContracts !== undefined)
      //     maxTradeSize = multiply(maxPermissibleContracts, totalFee.toString());
      // }
      // const tradeSizeError = getTradeSizeError(
      //   maxTradeSize,
      //   balance,
      //   amount
      // );
      // if (!!tradeSizeError) throw new Error(tradeSizeError);
      // const platformFeeError = getPlatformError({
      //   platfromFee: divide(
      //     activeMarket.config.platformFee,
      //     activeMarket.poolInfo.decimals
      //   ) as string,
      //   tradeSize: amount || '0',
      //   balance,
      // });
      // if (!!platformFeeError) throw new Error(platformFeeError);
      // const maxFeePerContracts =
      //   totalFee + (settings.slippageTolerance / 100) * totalFee;
      setLoading(isAbove ? 'Up' : 'Down');
      await writeCall(() => {}, 'initiateTrade', [
        [
          activeMarket.address,
          settings.partialFill,
          isAbove,
          selectedTimestamp / 1000,
          toFixed(multiply(amount, decimals), 0),
          referralData[2],
        ],
      ]);
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
