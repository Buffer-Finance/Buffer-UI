import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { IGQLHistory } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';

export const Timer: React.FC<{ trade: IGQLHistory }> = ({ trade }) => {
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > +trade.expirationTime) return <>processing...</>;
  const distance = formatDistance(
    Variables(trade.expirationTime - currentTime)
  );
  return <div className="text-[12px]">{distance}</div>;
};
