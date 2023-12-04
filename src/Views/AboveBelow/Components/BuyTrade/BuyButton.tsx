import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import {
  readCallDataAtom,
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { Skeleton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import RouterABI from '../../abis/Router.json';
import { ApproveBtn } from './ApproveBtn';

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

  if (activeMarket === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Market
        </BlueBtn>
      </ConnectionRequired>
    );

  if (readCallData === undefined) return <Skeleton />;
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

  if (lt(allowance, amount ?? '0')) {
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
      if (!amount) throw new Error('Please enter trade size');
      if (!selectedPrice) throw new Error('Please select strike price');
      if (!activeMarket) throw new Error('active market not found');
      const priceObj = selectedPrice[activeMarket.tv_id];
      setLoading('buy');
      await writeCall(() => {}, 'initiateTrade', [
        [
          activeMarket.address,
          settings.partialFill,
          '',
          priceObj.isAbove,
          amount,
          toFixed(multiply(priceObj.price.toString(), 8), 0),
          Math.floor(selectedTimestamp / 1000) + 1,
          '950000',
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
