import { useAtomValue } from 'jotai';
import { tradeSettingsAtom } from '../atoms';
import { useMemo } from 'react';

export const useLimitOrdersExpiry = () => {
  const tradeSettings = useAtomValue(tradeSettingsAtom);

  const limitOrderExpiryInMinutes = useMemo(() => {
    if (tradeSettings.selectedTimeFrame === 'm') {
      return tradeSettings.limitOrdersExpiry * 60;
    }
    if (tradeSettings.selectedTimeFrame === 'h') {
      return tradeSettings.limitOrdersExpiry * 60 * 60;
    }
  }, [tradeSettings.limitOrdersExpiry, tradeSettings.selectedTimeFrame]);

  return limitOrderExpiryInMinutes;
};
