import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { OngoingTradeSchema } from '@Views/TradePage/Hooks/useOngoingTrades';

export const TradeTimeElapsed: React.FC<{ trade: OngoingTradeSchema }> = ({
  trade,
}) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = trade.expiration_time;
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
