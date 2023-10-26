import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { TradeType } from '@Views/TradePage/type';
import { useEffect, useState } from 'react';

export const TradeTimeElapsed: React.FC<{
  trade: TradeType;
  stopTime?: number;
}> = ({ trade, stopTime }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!stopTime) {
      const timer = setInterval(() => {
        setCount(count + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [count]);
  let currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = trade.expiration_time;
  const closeTime = trade.close_time;
  if (closeTime) {
    currentTime = closeTime;
  }
  let timeElapsedPercent = 0;
  if (expirationTime) {
    const startTime = expirationTime - trade.period;
    if (stopTime) {
      currentTime = stopTime;
    }
    const elapsedTime = currentTime - startTime;
    timeElapsedPercent = Math.round((elapsedTime / trade.period) * 100);
  }
  timeElapsedPercent = Math.min(timeElapsedPercent, 100);
  return (
    <div className="my-3">
      <TimeElapsedBar progressPercent={timeElapsedPercent} />
    </div>
  );
};
