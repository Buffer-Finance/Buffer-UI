import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';

export const CountDown = ({ expiration }: { expiration: number | null }) => {
  if (!expiration) return <>null</>;
  const currentEpoch = Math.round(new Date().getTime() / 1000);
  const distance = expiration - currentEpoch;
  console.log('distance', distance, expiration, currentEpoch);
  return <div>{formatDistanceExpanded(Variables(distance))}</div>;
};
