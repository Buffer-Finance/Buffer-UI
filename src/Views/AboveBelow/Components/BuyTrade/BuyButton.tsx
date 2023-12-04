import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { tradeSettingsAtom, tradeSizeAtom } from '@Views/TradePage/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import RouterABI from '../../abis/Router.json';

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
          '0x1D76Fa23be51816588eBCd36DF466bB51D3ad084',
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
        id: 'buyTrade',
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
