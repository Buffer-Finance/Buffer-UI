import { useAtomValue } from 'jotai';
import { tradeSettingsAtom } from '../atoms';
import { useMemo } from 'react';
import { defaultSettings } from '@Views/ABTradePage/config';
import { multiply } from '@Utils/NumString/stringArithmatics';

export const useLimitOrdersExpiry = () => {
  const tradeSettings = useAtomValue(tradeSettingsAtom);

  const limitOrderExpiryInSeconds = useMemo(() => {
    if (
      tradeSettings.limitOrdersExpiry === '' ||
      tradeSettings.limitOrdersExpiry === '0' ||
      tradeSettings.limitOrdersExpiry === undefined
    )
      return multiply(defaultSettings.trade.limitOrdersExpiry, '60');
    if (tradeSettings.selectedTimeFrame === 'm') {
      return multiply(tradeSettings.limitOrdersExpiry, '60');
    }
    if (tradeSettings.selectedTimeFrame === 'h') {
      return multiply(tradeSettings.limitOrdersExpiry, '3600');
    }
  }, [tradeSettings.limitOrdersExpiry, tradeSettings.selectedTimeFrame]);

  // console.log(
  //   'limitOrderExpiryInSeconds',
  //   limitOrderExpiryInSeconds,
  //   tradeSettings.limitOrdersExpiry
  // );
  return limitOrderExpiryInSeconds;
};
