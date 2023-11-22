import { useTimer } from '@Hooks/Utilities/useStopWatch';
import { Timer } from './Timer';

export const NoLossV3Timer = ({
  close,
  isClosed,
  header,
  className = '',
  isUpcoming = false,
}: {
  close: string;
  isClosed: boolean;
  header?: string;
  className?: string;
  isUpcoming?: boolean;
}) => {
  const timer = useTimer(close.toString());

  if (isClosed)
    return (
      <div className={`text-f14 text-3 my-3 ${className}`}>
        This contest has ended.
      </div>
    );
  if (timer.seconds < 0)
    return (
      <div className={`text-f14 text-3 my-3 ${className}`}>
        This contest has expired.{' '}
        {isUpcoming
          ? 'Admin will remove it shortly.'
          : 'Admin will close it shortly'}
      </div>
    );
  let timerComponents = [];
  if (timer.days > 0) {
    timerComponents.push(<Timer header={timer.days} bottom="Days" />);
  }
  if (timerComponents.length > 0 || timer.hours > 0) {
    timerComponents.push(<Timer header={timer.hours} bottom="Hrs" />);
  }
  if (
    (timerComponents.length > 0 || timer.minutes > 0) &&
    timerComponents.length !== 2
  ) {
    timerComponents.push(<Timer header={timer.minutes} bottom="Mins" />);
  }
  if (timerComponents.length !== 2) {
    timerComponents.push(<Timer header={timer.seconds} bottom="Secs" />);
  }
  return (
    <div
      className={`text-1 text-f14 font-medium flex items-center gap-2 mt-[8px] mb-[10px] ${className}`}
    >
      <div className="mt-1 text-[#808191]">{header}</div>
      <div className="flex gap-2">
        {timerComponents.map((component, index) => (
          <div key={component.props.header}>{component}</div>
        ))}
      </div>
    </div>
  );
};
