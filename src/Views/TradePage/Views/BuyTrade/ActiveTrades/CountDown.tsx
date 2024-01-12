import {
  formatDistance,
  formatDistanceExpanded,
} from '@Hooks/Utilities/useStopWatch';
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

    return <div>{formatDistanceExpanded(Variables(distance / 1000))}</div>;
  }
  if (!expiration) return <>null</>;
  let currentEpoch = Math.round(new Date().getTime() / 1000);
  if (queuedTime && currentEpoch < queuedTime) {
    const startingDistance = queuedTime - currentEpoch;
    return <div>Starts in {formatDistance(Variables(startingDistance))}</div>;
  }
  const distance = expiration - currentEpoch;
  if (distance < 0) return <div>00h 00m 00s</div>;

  return <div>{formatDistance(Variables(distance))}</div>;
};
