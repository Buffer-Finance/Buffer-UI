import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { useEffect, useState } from 'react';

export const CountDown = ({
  expiration,
  closeTime,
}: {
  expiration: number | null;
  closeTime: number | null;
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  // console.log('CountDown', expiration, closeTime);
  if (closeTime && expiration) {
    const distance = expiration - closeTime;
    // if (distance < 0) return <div>00h 00m 00s</div>;
    // console.log('distance', distance, expiration, currentEpoch);
    return <div>{formatDistanceExpanded(Variables(distance))}</div>;
  }
  if (!expiration) return <>null</>;
  const currentEpoch = Math.round(new Date().getTime() / 1000);
  const distance = expiration - currentEpoch;
  if (distance < 0) return <div>00h 00m 00s</div>;
  // console.log('distance', distance, expiration, currentEpoch);
  return <div>{formatDistanceExpanded(Variables(distance))}</div>;
};
