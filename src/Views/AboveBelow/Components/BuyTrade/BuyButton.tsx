import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { priceAtom } from '@Hooks/usePrice';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { selectedExpiry } from '@Views/AboveBelow/atoms';
import { BlueBtn } from '@Views/Common/V2-Button';
import { tradeSettingsAtom, tradeSizeAtom } from '@Views/TradePage/atoms';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import RouterABI from '../../abis/Router.json';
import { getRoundedPrice } from './PriceTable/helpers';

export const Buy = () => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const { writeCall } = useWriteCall(config.above_below_router, RouterABI);
  const toastify = useToast();
  const [loading, setLoading] = useState<'Above' | 'Below' | 'None'>('None');
  const price = useAtomValue(priceAtom);
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const [settings] = useAtom(tradeSettingsAtom);
  const amount = useAtomValue(tradeSizeAtom);
  const currentPrice = price['BTCUSD']?.[0].price;

  async function buyTrade(above: boolean = true) {
    try {
      if (!selectedTimestamp) throw new Error('Please select expiry date');
      if (!amount) throw new Error('Please enter trade size');
      if (!currentPrice) throw new Error('Please enter current price');
      const roundedPrice = getRoundedPrice(+currentPrice, 500);
      setLoading(above ? 'Above' : 'Below');
      await writeCall(() => {}, 'initiateTrade', [
        [
          '0x1D76Fa23be51816588eBCd36DF466bB51D3ad084',
          settings.partialFill,
          '',
          above,
          amount,
          toFixed(multiply(('' + roundedPrice).toString(), 8), 0),
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
    <div className="flex gap-3">
      <BlueBtn
        onClick={() => buyTrade()}
        isLoading={loading === 'Above'}
        isDisabled={loading !== 'None'}
      >
        Above
      </BlueBtn>
      <BlueBtn
        onClick={() => buyTrade(false)}
        isLoading={loading === 'Below'}
        isDisabled={loading !== 'None'}
      >
        Below
      </BlueBtn>
    </div>
  );
};
