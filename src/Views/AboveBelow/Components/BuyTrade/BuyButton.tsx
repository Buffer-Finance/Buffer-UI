import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { toFixed } from '@Utils/NumString';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { useSettlementFee } from '@Views/AboveBelow/Hooks/useSettlementFee';
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
import { solidityKeccak256 } from 'ethers/lib/utils';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { getAddress } from 'viem';
import RouterABI from '../../abis/Router.json';
import { ApproveBtn } from './ApproveBtn';
import { getPlatformError, getTradeSizeError } from './TradeSize';

export const Buy = () => {
  const { activeChain } = useActiveChain();
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

  const { currentPrice, precision } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const { data: settlementFees } = useSettlementFee();

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
  async function buyTrade() {
    try {
      if (!selectedTimestamp) throw new Error('Please select expiry date');
      if (!selectedPrice) throw new Error('Please select strike price');
      if (!readCallData) throw new Error('Error fetching data');
      if (!activeMarket) throw new Error('active market not found');

      if (!activeMarket) throw new Error('active market not found');
      if (!currentPrice) throw new Error('current price not found');
      if (!settlementFees) throw new Error('settlement fees not found');
      const slippageError = getSlippageError(settings.slippageTolerance);
      if (slippageError !== null) throw new Error(slippageError);
      const priceObj = selectedPrice[activeMarket.tv_id];
      const price = priceObj.price;
      if (!price) throw new Error('Please select strike price');
      const expiration = Math.floor(selectedTimestamp / 1000);
      const currentEpoch = Math.floor(Date.now() / 1000);
      const marketHash = solidityKeccak256(
        ['uint256', 'uint256'],
        [
          toFixed(multiply(price, 8), 0),
          Math.floor(selectedTimestamp / 1000) + 1,
        ]
      );
      const settlementFee =
        settlementFees[marketHash + '-' + getAddress(activeMarket.address)];
      const probability = BlackScholes(
        true,
        priceObj.isAbove,
        currentPrice,
        price,
        expiration - currentEpoch,
        0,
        1.2
      );
      const totalFee =
        probability +
        ((priceObj.isAbove
          ? settlementFee?.sf_above
          : settlementFee?.sf_below) || settlementFees['Base'] / 1e4) *
          probability;
      const balance =
        divide(readCallData.balances[token], decimals) ?? ('0' as string);
      const tradeSizeError = getTradeSizeError(
        toFixed(totalFee.toString(), 2),
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
          toFixed(divide(amount, totalFee.toString()) as string, 0),
          toFixed(multiply(price, 8), 0),
          expiration,
          toFixed(multiply(maxFeePerContracts.toString(), decimals), 0),
          ,
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
