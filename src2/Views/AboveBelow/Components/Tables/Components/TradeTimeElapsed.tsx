import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { useEffect, useState } from 'react';

export const TradeTimeElapsed: React.FC<{
  trade: IGQLHistory;
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
  const expirationTime = +trade.expirationTime;
  let timeElapsedPercent = 0;
  if (expirationTime) {
    const startTime = trade.creationTime as string;
    if (stopTime) {
      currentTime = stopTime;
    }
    const elapsedTime = currentTime - +startTime;
    const period = expirationTime - +startTime;
    timeElapsedPercent = Math.round((elapsedTime / period) * 100);
  }
  timeElapsedPercent = Math.min(timeElapsedPercent, 100);
  return (
    <div className="my-3">
      <TimeElapsedBar progressPercent={timeElapsedPercent} />
    </div>
  );
};
