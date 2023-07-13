import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { TradeType } from '@Views/TradePage/type';

export const TradeTimeElapsed: React.FC<{ trade: TradeType }> = ({ trade }) => {
  let currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = trade.expiration_time;
  const closeTime = trade.close_time;
  if (closeTime) {
    currentTime = closeTime;
  }
  let timeElapsedPercent = 0;
  if (expirationTime) {
    const startTime = expirationTime - trade.period;
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
