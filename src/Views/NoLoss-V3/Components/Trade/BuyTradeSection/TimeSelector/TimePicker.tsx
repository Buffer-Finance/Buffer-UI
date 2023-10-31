import { lt, lte } from '@Utils/NumString/stringArithmatics';
import { durations } from '@Views/NoLoss-V3/config';
import { EditIconSVG } from '@Views/TradePage/Components/EditIconSVG';
import { RowGap } from '@Views/TradePage/Components/Row';
import { MHdropDown } from '@Views/TradePage/Views/Settings/TradeSettings/LimitOrdersExpiry/MHdropDown';
import { HHMMToSeconds, secondsToHHMM } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';

const TimePickerBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .duration-container {
    display: flex;
    gap: 3px;
    width: 100%;
    align-items: stretch;
    justify-content: space-between;

    .each-duration {
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      border-radius: 6px;
      padding: 6px 8.55px;
      border: 1px solid transparent;
      background: #2b2b39;

      &.active {
        background: #141823;
        border: 1px solid #a3e3ff;
      }
    }

    .edit-duration {
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      border-radius: 6px;
      padding: 0 2px 0 0;
      border: 1px solid transparent;
      background: #2b2b39;

      &.active {
        background: #141823;
        border: 1px solid #a3e3ff;
      }
    }
  }
`;

export const TimePicker: React.FC<{
  currentTime: string;
  max_duration: string;
  min_duration: string;
  setCurrentTime: (newTime: string) => void;
  onSelect?: (a: any) => void;
}> = ({
  currentTime,
  setCurrentTime,
  max_duration,
  min_duration,
  onSelect,
}) => {
  const [openCustomInput, setOpenCustomInput] = useState(false);
  useEffect(() => {
    // console.log('currentTime', currentTime);
    if (!openCustomInput) {
      const duration = durations.find((d) => d.time === currentTime);
      if (duration === undefined) {
        setOpenCustomInput(true);
      }
    }
  }, [openCustomInput, currentTime]);

  return (
    <TimePickerBackground>
      <div className="duration-container ">
        {durations.map((single, idx) => {
          const durationIntoSeconds = single.duration;

          const isDisabled =
            durationIntoSeconds > HHMMToSeconds(max_duration) ||
            durationIntoSeconds < HHMMToSeconds(min_duration);

          const singleDuration = single.duration;

          return (
            <div
              key={single.duration}
              onClick={() => {
                if (isDisabled) return;
                onSelect?.(single);
                setCurrentTime(single.time);
                setOpenCustomInput(false);
              }}
              className={
                'each-duration py-1 font-medium text-f14  transition-colors ' +
                (HHMMToSeconds(currentTime) === singleDuration && !isDisabled
                  ? 'active text-1 '
                  : 'text-2') +
                (isDisabled
                  ? ' !cursor-not-allowed opacity-40'
                  : ' hover:text-1 hover:brightness-150')
              }
            >
              {single.name.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
          );
        })}
        <div
          className={`${
            openCustomInput ? 'active edit-duration' : 'each-duration'
          }`}
          onClick={() => {
            setOpenCustomInput(true);
          }}
        >
          <EditTime
            showCustomInput={openCustomInput}
            setTime={setCurrentTime}
            initialValue={currentTime}
          />
        </div>
      </div>
      <TimerError
        currentTime={currentTime}
        maxDuration={max_duration}
        minDuration={min_duration}
      />
    </TimePickerBackground>
  );
};

export function getDurationError(
  currentTime: string,
  maxDuration: string,
  minDuration: string
) {
  if (HHMMToSeconds(currentTime) > HHMMToSeconds(maxDuration)) {
    return `Maximum duration is ${maxDuration}`;
  } else if (HHMMToSeconds(currentTime) < HHMMToSeconds(minDuration)) {
    return `Minimum duration is ${minDuration}`;
  } else {
    return null;
  }
}

const TimerError: React.FC<{
  currentTime: string;
  minDuration: string;
  maxDuration: string;
}> = ({ currentTime, maxDuration, minDuration }) => {
  const error = getDurationError(currentTime, maxDuration, minDuration);
  return (
    <Trans>
      <span className="text-red whitespace-nowrap">{error}</span>
    </Trans>
  );
};

const EditTime: React.FC<{
  showCustomInput: boolean;
  setTime: (newMMHHtime: string) => void;
  initialValue: string;
}> = ({ showCustomInput, setTime, initialValue }) => {
  const [activeFrame, setActiveFrame] = useState('m');
  const [inputValue, setInputValue] = useState<number | ''>(30);
  const MAX = activeFrame === 'm' ? 60 : 24;

  function onChange(newInput: number | '') {
    setInputValue(newInput);
    // console.log('newInput', newInput);

    let seconds = 0;
    if (activeFrame === 'm') {
      seconds = (newInput as number) * 60;
    } else {
      seconds = (newInput as number) * 3600;
    }
    const newMMHHtime = secondsToHHMM(seconds);
    setTime(newMMHHtime);
  }

  useEffect(() => {
    if (inputValue === '') {
      setActiveFrame('m');
      setInputValue(30);
    } else if (showCustomInput) onChange(inputValue);
  }, [showCustomInput]);

  useEffect(() => {
    if (initialValue !== '00:00') {
      const [hours, minutes] = initialValue.split(':');
      if (hours === '00' && lte(minutes, '60')) {
        setActiveFrame('m');
        setInputValue(+minutes);
      } else {
        setActiveFrame('h');
        setInputValue(+hours);
      }
    } else {
      {
        setActiveFrame('m');
        setInputValue(30);
      }
    }
  }, []);

  if (showCustomInput) {
    return (
      <RowGap gap="2px" className="h-full">
        <input
          value={inputValue}
          type="number"
          max={MAX}
          min={1}
          className={`bg-transparent rounded-[5px] text-center w-[20px] text-1 outline-none`}
          onChange={(e) => {
            if (e.target.value === '') return onChange('');
            if (e.target.value === '-') {
              return onChange('');
            } else if (lt(e.target.value, '0')) {
              return onChange('');
            } else if (e.target.value === '.' || e.target.value.length > 2) {
              return onChange(+e.target.value.slice(0, 2));
            } else if (+e.target.value > MAX) {
              return onChange(MAX);
            } else {
              onChange(+e.target.value);
            }
          }}
          placeholder="10"
        />
        <MHdropDown
          activeFrame={activeFrame}
          setFrame={setActiveFrame}
          onClickFunction={(frame: string | undefined) => {
            if (frame === undefined) return;
            if (inputValue === '') return;
            if (frame.trim() === 'h' && inputValue > 24) {
              onChange(24);
            } else {
              onChange(inputValue);
            }
          }}
          className="px-[2px] py-[0] !bg-[#303044] rounded-[2px]"
        />
      </RowGap>
    );
  }
  return <EditIconSVG />;
};
