import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { useEffect, useState } from 'react';

export const CountDown = ({
  expiration,
  closeTime,
  queuedTime,
}: {
  expiration: number | null;
  closeTime: number | null;

  queuedTime?: number | null;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  if (closeTime && expiration) {
    const distance = expiration - closeTime;

    return <div>{formatDistance(Variables(distance))}</div>;
  }
  if (!expiration) return <div></div>;
  let currentEpoch = Math.round(new Date().getTime() / 1000);
  if (queuedTime && currentEpoch < queuedTime) {
    const startingDistance = queuedTime - currentEpoch;
    return (
      <div key={'queued'}>
        Starts in {formatDistance(Variables(startingDistance))}
      </div>
    );
  }
  const distance = expiration - currentEpoch;
  if (distance < 0) return <div key={'time over'}>00h 00m 00s</div>;

  return <div key={'started'}>{formatDistance(Variables(distance))}</div>;
};
