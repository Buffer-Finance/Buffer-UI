import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { useIV } from '@Views/AboveBelow/Hooks/useIV';
import { useIsInCreationWindow } from '@Views/AboveBelow/Hooks/useIsInCreationWIndow';
import { strikePrices } from '@Views/AboveBelow/Hooks/useLimitedStrikeArrays';
import {
  readCallDataAtom,
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { getSlippageError } from '@Views/TradePage/Views/Settings/TradeSettings/Slippage/SlippageError';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { Skeleton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { getAddress } from 'viem';
import RouterABI from '../../abis/Router.json';
import { ApproveBtn } from './ApproveBtn';
import { getPlatformError, getTradeSizeError } from './TradeSize';
import { useApprvalAmount } from '@Views/TradePage/Hooks/useApprovalAmount';
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
  const d = useApprvalAmount();
  console.log(`BuyButton-d: `, d);
  const config = getConfig(activeChain.id);
  const { writeCall } = useWriteCall(config.above_below_router, RouterABI);
  const toastify = useToast();
  const [loading, setLoading] = useState<'buy' | 'approve' | 'None'>('None');
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const [settings] = useAtom(tradeSettingsAtom);
  const amount = useAtomValue(tradeSizeAtom);
  const selectedPrice = useAtomValue(selectedPriceAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const readCallData = useAtomValue(readCallDataAtom);
  const referralData = useReferralCode();
  const { data: ivs } = useIV();

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

  if (selectedPrice === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Strike Price
        </BlueBtn>
      </ConnectionRequired>
    );
  const priceObj = selectedPrice[activeMarket.tv_id];
  if (!priceObj)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Strike Price
        </BlueBtn>
      </ConnectionRequired>
    );
  const price = priceObj.price;

  const maxPermissibleMarket =
    readCallData.maxPermissibleContracts[
      getAddress(activeMarket.address) + price
    ];

  if (maxPermissibleMarket === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true} isLoading>
          Fetching data...
        </BlueBtn>
      </ConnectionRequired>
    );

  const maxPermissibleContracts = maxPermissibleMarket.maxPermissibleContracts;
  if (maxPermissibleContracts === undefined) {
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Max Trade Size not found
        </BlueBtn>
      </ConnectionRequired>
    );
  }
  async function buyTrade() {
    try {
      if (!selectedTimestamp) throw new Error('Please select expiry date');
      if (!selectedPrice) throw new Error('Please select strike price');
      if (!readCallData) throw new Error('Error fetching data');
      if (!activeMarket) throw new Error('active market not found');
      if (!currentPrice) throw new Error('current price not found');
      const strikes = strikePrices;
      const activeAssetStrikes = strikes[activeMarket.tv_id];
      if (!activeAssetStrikes)
        throw new Error('active asset strikes not found');
      const iv = ivs?.[activeMarket.tv_id];
      if (iv === undefined) throw new Error('iv not found');
      const slippageError = getSlippageError(settings.slippageTolerance);
      if (slippageError !== null) throw new Error(slippageError);
      const priceObj = selectedPrice[activeMarket.tv_id];
      if (!priceObj) throw new Error('price obj not found');
      const price = priceObj.price;
      let strikePriceObject = activeAssetStrikes.increasingPriceArray.find(
        (obj) => obj.strike.toString() == priceObj.price
      );
      if (!strikePriceObject) {
        strikePriceObject = activeAssetStrikes.decreasingPriceArray.find(
          (obj) => obj.strike.toString() == priceObj.price
        );
      }
      if (!strikePriceObject) throw new Error('Please select a strike price');
      const totalFee = priceObj.isAbove
        ? strikePriceObject.totalFeeAbove
        : strikePriceObject.totalFeeBelow;
      if (!totalFee) throw new Error('total fee not found');
      const expiration = Math.floor(selectedTimestamp / 1000);

      const balance =
        divide(readCallData.balances[token], decimals) ?? ('0' as string);

      const maxTradeSize = multiply(
        divide(maxPermissibleContracts as string, decimals) as string,
        totalFee.toString()
      );

      const tradeSizeError = getTradeSizeError(
        // toFixed(totalFee.toString(), 2),
        maxTradeSize,
        balance,
        amount
      );
      if (!!tradeSizeError) throw new Error(tradeSizeError);
      const platformFeeError = getPlatformError({
        platfromFee: divide(
          activeMarket.config.platformFee,
          activeMarket.poolInfo.decimals
        ) as string,
        tradeSize: amount || '0',
        balance,
      });
      if (!!platformFeeError) throw new Error(platformFeeError);
      const maxFeePerContracts =
        totalFee + (settings.slippageTolerance / 100) * totalFee;
      setLoading('buy');
      await writeCall(() => {}, 'initiateTrade', [
        [
          activeMarket.address,
          settings.partialFill,
          referralData[2],
          priceObj.isAbove,
          toFixed(multiply(amount, decimals), 0),
          toFixed(multiply(price, 8), 0),
          expiration,
          toFixed(multiply(maxFeePerContracts.toString(), decimals), 0),
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
      <BlueBtn
        onClick={buyTrade}
        isLoading={loading === 'buy'}
        isDisabled={loading !== 'None'}
      >
        Buy
      </BlueBtn>
    </ConnectionRequired>
  );
};
