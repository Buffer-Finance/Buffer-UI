import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { OngoingTradeSchema } from '@Views/TradePage/Hooks/ongoingTrades';

export const TradeTimeElapsed: React.FC<{ trade: OngoingTradeSchema }> = ({
  trade,
}) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = trade.expiration_time;
  let timeElapsedPercent = 0;
  if (expirationTime)
    timeElapsedPercent = Math.round(
      ((currentTime - expirationTime) / expirationTime) * 100
    );

  return (
    <div className="my-3">
      <TimeElapsedBar progressPercent={timeElapsedPercent} />
    </div>
  );
};
