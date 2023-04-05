import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import EditIcon from 'public/ComponentSVGS/Edit';
import { QuickTradeExpiry } from '.';
import { useQTinfo } from '..';
import { getUserError, TimeSelector, timeToMins } from './TimeSelector';
import { isTestnet } from 'config';

export const DurationPicker = ({ onSelect }: { onSelect?: () => void }) => {
  const qtInfo = useQTinfo();
  const activeAsset = qtInfo.activePair;
  const [currentTime, setCurrentTime] = useAtom(QuickTradeExpiry);
  const [, setDur] = useState(0);
  const [openCustomInput, setOpenCustomInput] = useState(false);
  const oneSec = 1000;
  const durations = [
    {
      duration: 1 * 60 * oneSec,
      time: '00:01',
      name: ['1', 'Min'],
    },
    {
      duration: 5 * 60 * oneSec,
      time: '00:05',
      name: ['5', 'Min'],
    },
    {
      duration: 15 * 60 * oneSec,
      time: '00:15',
      name: ['15', 'Min'],
    },
    {
      duration: 60 * 60 * oneSec,
      time: '01:00',
      name: ['1', 'Hour'],
    },
    {
      duration: 4 * 60 * 60 * oneSec,
      time: '04:00',
      name: ['4', 'Hour'],
    },
    {
      duration: 24 * 60 * 60 * oneSec,
      time: '23:59',
      name: ['24', 'Hour'],
    },
    //the last one is replaced with edit button
    {
      duration: 24 * 60 * 60 * oneSec,
      time: '23:59',
      name: ['24', 'Hour'],
    },
  ];

  useEffect(() => {
    if (!currentTime || !activeAsset) return;
    localStorage.setItem('exp', currentTime);
    const activeDuration = durations.find(
      (item) => item.duration === timeToMins(currentTime) * 60 * oneSec
    );
    if (
      !activeDuration ||
      activeDuration.duration >
        timeToMins(activeAsset.max_duration) * 60 * oneSec ||
      activeDuration.duration <
        timeToMins(activeAsset.min_duration) * 60 * oneSec
    )
      setOpenCustomInput(true);
    // else setOpenCustomInput(false);
  }, [currentTime, activeAsset]);

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
                durationIntoSeconds >
                  timeToMins(activeAsset.max_duration) * 60 * oneSec) ||
              durationIntoSeconds <
                timeToMins(activeAsset.min_duration) * 60 * oneSec;
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
                  'each-duration py-1 font-medium text-f12 h-[55px] transition-colors ' +
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
            maxTime={activeAsset.max_duration}
            minTime={activeAsset.min_duration}
            error={{
              min: timeToMins(activeAsset.min_duration),
              minMsg: `Can't set expiry lower than ${getUserError(
                activeAsset.min_duration
              )}.`,
              max: timeToMins(activeAsset.max_duration),
              maxMsg: `Can't set expiry of more than ${getUserError(
                activeAsset.max_duration
              )}.`,
            }}
          />
        </>
      )}
    </>
  );
};
