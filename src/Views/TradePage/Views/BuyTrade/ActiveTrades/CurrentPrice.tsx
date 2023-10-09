import { priceAtom, wsStatusAtom } from '@Hooks/usePrice';
import { Display } from '@Views/Common/Tooltips/Display';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

export const CurrentPrice: React.FC<{
  token0: string;
  token1: string;
}> = ({ token0, token1 }) => {
  const { currentPrice, precision: marketPrecision } = useCurrentPrice({
    token0,
    token1,
  });
  const marketPrice = useAtomValue(priceAtom);
  function getLag(ts) {
    if (!ts) return 0;
    else {
      const currentTs = Date.now();
      const lag = currentTs - ts;
      return lag / 1000;
    }
  }
  const [_, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setCount((cnt) => cnt + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const wsStatus = useAtomValue(wsStatusAtom);

  const lagg = getLag(marketPrice.ts);
  const danger = lagg > 15 || (wsStatus.retry > 1 && !wsStatus.isConnected);
  return (
    <>
      <Display
        className="!justify-start"
        data={currentPrice}
        precision={marketPrecision}
      />

      <span className={`text-f12 ${danger ? 'text-red' : ''}`}>
        {danger ? (
          'Danger!! Price is too stale'
        ) : !lagg ? (
          'Fetching...'
        ) : (
          <>
            ~{lagg}s (Retry:{wsStatus.retry})
          </>
        )}
      </span>
    </>
  );
};
