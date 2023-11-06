import { useTimer } from '@Hooks/Utilities/useStopWatch';
import { Timer } from './Timer';

export const NoLossV3Timer = ({
  close,
  isClosed,
}: {
  close: string;
  isClosed: boolean;
}) => {
  const timer = useTimer(close.toString());
  if (isClosed)
    return <div className="text-f14 text-3 my-3">This contest has ended.</div>;
  if (timer.seconds < 0)
    return (
      <div className="text-f14 text-3 my-3">
        This contest has expired. Admin will close it shortly
      </div>
    );
  return (
    <div className="text-1 flex gap-x-[8px] mt-[8px] mb-[10px]">
      <Timer header={timer.days} bottom="Days" />
      <Timer header={timer.hours} bottom="Hrs" />
      <Timer header={timer.minutes} bottom="Mins" />
      <Timer header={timer.seconds} bottom="Secs" />
    </div>
  );
};
