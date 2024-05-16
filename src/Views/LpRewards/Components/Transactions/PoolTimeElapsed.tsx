import { poolTxn } from '@Views/LpRewards/types';
import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { useEffect, useState } from 'react';

export const PoolTimeElapsed: React.FC<{
  trade: poolTxn;
}> = ({ trade }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  let currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = Number(trade.timestamp) + Number(trade.lockPeriod);
  let timeElapsedPercent = 0;
  if (expirationTime) {
    const startTime = Number(trade.timestamp);

    const elapsedTime = currentTime - startTime;
    timeElapsedPercent = Math.round(
      (elapsedTime / Number(trade.lockPeriod)) * 100
    );
  }
  timeElapsedPercent = Math.min(timeElapsedPercent, 100);
  return (
    <div className="my-3">
      <TimeElapsedBar progressPercent={timeElapsedPercent} />
    </div>
  );
};
