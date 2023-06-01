import { useEffect, useState } from 'react';
import EditIcon from 'public/ComponentSVGS/Edit';
import { getUserError, TimeSelector, timeToMins } from './TimeSelector';
import { useV3AppActiveMarket } from '@Views/V3App/Utils/useV3AppActiveMarket';
import { useSwitchPoolForTrade } from '@Views/V3App/Utils/useSwitchPoolForTrade';

export const DurationPicker = ({
  currentTime,
  setCurrentTime,
  onSelect,
}: {
  currentTime: string;
  setCurrentTime: (a: string) => void;
  onSelect: (a: any) => void;
}) => {
  const { activeMarket: activeAsset } = useV3AppActiveMarket();
  const { switchPool, poolDetails } = useSwitchPoolForTrade();
  const [, setDur] = useState(0);
  const [openCustomInput, setOpenCustomInput] = useState(false);
  const oneSec = 1000;
  const durations = [
    // {
    //   duration: 1 * 60 * oneSec,
    //   time: '00:01',
    //   name: ['1'],
    // },
    {
      duration: 3 * 60 * oneSec,
      time: '00:03',
      name: ['3m'],
    },
    {
      duration: 5 * 60 * oneSec,
      time: '00:05',
      name: ['5m'],
    },
    {
      duration: 15 * 60 * oneSec,
      time: '00:15',
      name: ['15m'],
    },
    {
      duration: 60 * 60 * oneSec,
      time: '01:00',
      name: ['1h'],
    },
    {
      duration: 4 * 60 * 60 * oneSec,
      time: '04:00',
      name: ['4h'],
    },
    {
      duration: 24 * 60 * 60 * oneSec,
      time: '23:59',
      name: ['24h'],
    },
  ];

  useEffect(() => {
    if (!currentTime || !activeAsset || !poolDetails || !switchPool) return;
    localStorage.setItem('exp', currentTime);
    const activeDuration = durations.find(
      (item) => item.duration === timeToMins(currentTime) * 60 * oneSec
    );
    if (
      !activeDuration ||
      activeDuration.duration >
        timeToMins(switchPool.max_duration) * 60 * oneSec ||
      activeDuration.duration <
        timeToMins(switchPool.min_duration) * 60 * oneSec
    )
      setOpenCustomInput(true);
    // else setOpenCustomInput(false);
  }, [currentTime, activeAsset]);

  if (!activeAsset || !poolDetails || !switchPool) return <></>;

  const maxDuration = switchPool.max_duration;
  const minDuration = switchPool.min_duration;

  return (
    <>
      <div className="duration">
        <div className="duration-container ">
          {durations.map((single, idx) => {
            const isLastElement = idx === durations.length - 1;
            const durationIntoSeconds = !isLastElement
              ? single.duration
              : single.duration - 60 * oneSec;

            const isDisabled =
              (!isLastElement &&
                durationIntoSeconds > timeToMins(maxDuration) * 60 * oneSec) ||
              durationIntoSeconds < timeToMins(minDuration) * 60 * oneSec;
            const singleDuration = isLastElement
              ? single.duration - 60 * oneSec
              : single.duration;

            return (
              <div
                key={single.duration}
                onClick={() => {
                  if (isDisabled) return;
                  if (isLastElement) return setOpenCustomInput(true);
                  // onSelect?.();
                  setCurrentTime(single.time);
                  setDur(idx);
                  setOpenCustomInput(false);
                }}
                className={
                  'each-duration py-1 font-medium text-f12  transition-colors ' +
                  ((timeToMins(currentTime) * 60 * oneSec === singleDuration &&
                    !isDisabled) ||
                  (isLastElement && openCustomInput)
                    ? 'active text-1 '
                    : 'text-2') +
                  (isDisabled
                    ? ' !cursor-not-allowed opacity-40'
                    : ' hover:text-1 hover:brightness-150')
                }
              >
                {isLastElement ? (
                  <EditIcon active={openCustomInput} />
                ) : (
                  single.name.map((d) => <div key={d}>{d}</div>)
                )}
              </div>
            );
          })}
        </div>
        {/* {isForex && !isMarketOpen && (
          <div className="text-f12 flex items-start text-1 mt-3">
            <ErrorIcon className="mt-2 error-icon" />
            Trading is closed for Forex aseets right now.
          </div>
        )} */}
      </div>{' '}
      {openCustomInput && (
        <>
          <div className="text-f14">Time (hh:mm) </div>
          <TimeSelector
            isTimeSelector
            onSelect={onSelect}
            currentTime={currentTime}
            setTime={(newValue) => setCurrentTime(newValue)}
            maxTime={maxDuration}
            minTime={minDuration}
            error={{
              min: timeToMins(minDuration),
              minMsg: `Can't set expiry lower than ${getUserError(
                minDuration
              )}.`,
              max: timeToMins(maxDuration),
              maxMsg: `Can't set expiry of more than ${getUserError(
                maxDuration
              )}.`,
            }}
          />
        </>
      )}
    </>
  );
};

export const DynamicDurationPicker = ({
  currentTime,
  setCurrentTime,
  max_duration,
  min_duration,
  onSelect,
}: {
  currentTime: number;
  max_duration: string;
  min_duration: string;
  setCurrentTime: (a: any) => void;
  onSelect: (a: any) => void;
}) => {
  const [, setDur] = useState(0);
  const [openCustomInput, setOpenCustomInput] = useState(false);
  const oneSec = 1000;
  const durations = [
    // {
    //   duration: 1 * 60 * oneSec,
    //   time: '00:01',
    //   name: ['1'],
    // },
    {
      duration: 3 * 60 * oneSec,
      time: '00:03',
      name: ['3m'],
    },
    {
      duration: 5 * 60 * oneSec,
      time: '00:05',
      name: ['5m'],
    },
    {
      duration: 15 * 60 * oneSec,
      time: '00:15',
      name: ['15m'],
    },
    {
      duration: 60 * 60 * oneSec,
      time: '01:00',
      name: ['1h'],
    },
    {
      duration: 4 * 60 * 60 * oneSec,
      time: '04:00',
      name: ['4h'],
    },
    {
      duration: 24 * 60 * 60 * oneSec,
      time: '23:59',
      name: ['24h'],
    },
  ];

  useEffect(() => {
    if (!currentTime) return;
    localStorage.setItem('exp', currentTime);
    const activeDuration = durations.find(
      (item) => item.duration === timeToMins(currentTime) * 60 * oneSec
    );
    if (
      !activeDuration ||
      activeDuration.duration > timeToMins(max_duration) * 60 * oneSec ||
      activeDuration.duration < timeToMins(min_duration) * 60 * oneSec
    )
      setOpenCustomInput(true);
    // else setOpenCustomInput(false);
  }, [currentTime]);

  return (
    <>
      <div className="duration">
        <div className="duration-container ">
          {durations.map((single, idx) => {
            const isLastElement = idx === durations.length - 1;
            const durationIntoSeconds = !isLastElement
              ? single.duration
              : single.duration - 60 * oneSec;

            const isDisabled =
              (!isLastElement &&
                durationIntoSeconds > timeToMins(max_duration) * 60 * oneSec) ||
              durationIntoSeconds < timeToMins(min_duration) * 60 * oneSec;
            const singleDuration = isLastElement
              ? single.duration - 60 * oneSec
              : single.duration;

            return (
              <div
                key={single.duration}
                onClick={() => {
                  if (isDisabled) return;
                  if (isLastElement) return setOpenCustomInput(true);
                  onSelect?.();
                  setCurrentTime(single.time);
                  setDur(idx);
                  setOpenCustomInput(false);
                }}
                className={
                  'each-duration py-1 font-medium text-f12  transition-colors ' +
                  ((timeToMins(currentTime) * 60 * oneSec === singleDuration &&
                    !isDisabled) ||
                  (isLastElement && openCustomInput)
                    ? 'active text-1 '
                    : 'text-2') +
                  (isDisabled
                    ? ' !cursor-not-allowed opacity-40'
                    : ' hover:text-1 hover:brightness-150')
                }
              >
                {isLastElement ? (
                  <EditIcon active={openCustomInput} />
                ) : (
                  single.name.map((d) => <div key={d}>{d}</div>)
                )}
              </div>
            );
          })}
        </div>
        {/* {isForex && !isMarketOpen && (
          <div className="text-f12 flex items-start text-1 mt-3">
            <ErrorIcon className="mt-2 error-icon" />
            Trading is closed for Forex aseets right now.
          </div>
        )} */}
      </div>{' '}
      {openCustomInput && (
        <>
          <div className="text-f14">Time (hh:mm) </div>
          <TimeSelector
            isTimeSelector
            onSelect={onSelect}
            currentTime={currentTime}
            setTime={(newValue) => setCurrentTime(newValue)}
            maxTime={max_duration}
            minTime={min_duration}
            error={{
              min: timeToMins(min_duration),
              minMsg: `Can't set expiry lower than ${getUserError(
                min_duration
              )}.`,
              max: timeToMins(max_duration),
              maxMsg: `Can't set expiry of more than ${getUserError(
                max_duration
              )}.`,
            }}
          />
        </>
      )}
    </>
  );
};
