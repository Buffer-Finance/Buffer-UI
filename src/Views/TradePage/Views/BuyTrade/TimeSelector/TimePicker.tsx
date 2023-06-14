import { EditIconSVG } from '@Views/TradePage/Components/EditIconSVG';
import { durations } from '@Views/TradePage/config';
import { HHMMToSeconds, secondsToHHMM } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { useState } from 'react';
import { MHdropDown } from '../../Settings/TradeSettings/LimitOrdersExpiry/MHdropDown';
import { MinutesInput } from '../../Settings/TradeSettings/LimitOrdersExpiry/MinutesInput';

const TimePickerBackground = styled.div`
  .duration-container {
    display: flex;
    gap: 3px;
    width: 100%;
    align-items: center;
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
        <button
          className={`each-duration ${openCustomInput ? 'active' : ''}`}
          onClick={() => {
            setOpenCustomInput(true);
          }}
        >
          <EditTime
            showCustomInput={openCustomInput}
            setTime={setCurrentTime}
          />
        </button>
      </div>
    </TimePickerBackground>
  );
};

const EditTime: React.FC<{
  showCustomInput: boolean;
  setTime: (newMMHHtime: string) => void;
}> = ({ showCustomInput, setTime }) => {
  const [activeFrame, setActiveFrame] = useState('m');
  const [inputValue, setInputValue] = useState(30);

  function onChange(newInput: number) {
    setInputValue(newInput);

    let seconds = 0;
    if (activeFrame === 'm') {
      seconds = newInput * 60;
    } else {
      seconds = newInput * 3600;
    }
    const newMMHHtime = secondsToHHMM(seconds);
    setTime(newMMHHtime);
  }

  if (showCustomInput) {
    return (
      <MinutesInput
        activeFrame={activeFrame}
        setFrame={setActiveFrame}
        minutes={inputValue}
        onChange={onChange}
      />
    );
  }
  return <EditIconSVG />;
};
