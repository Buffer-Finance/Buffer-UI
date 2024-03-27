import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { useEffect, useState } from 'react';

export const Timer: React.FC<{ trade: IGQLHistory }> = ({ trade }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime > +trade.expirationTime) return <>processing...</>;
  const distance = formatDistance(
    Variables(trade.expirationTime - currentTime)
  );
  return <div className="text-[12px]">{distance}</div>;
};
