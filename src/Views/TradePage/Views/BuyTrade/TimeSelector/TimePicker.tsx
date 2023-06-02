import { EditIconSVG } from '@Views/TradePage/Components/EditIconSVG';
import { durations } from '@Views/TradePage/config';
import { HHMMToSeconds } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { useState } from 'react';

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
          const isLastElement = idx === durations.length - 1;
          const durationIntoSeconds = !isLastElement
            ? single.duration
            : single.duration - 60;

          const isDisabled = !isLastElement
            ? durationIntoSeconds > HHMMToSeconds(max_duration) ||
              durationIntoSeconds < HHMMToSeconds(min_duration)
            : false;

          const singleDuration = isLastElement
            ? single.duration - 60
            : single.duration;

          return (
            <div
              key={single.duration}
              onClick={() => {
                if (isDisabled) return;
                if (isLastElement) return setOpenCustomInput(true);
                onSelect?.(single);
                setCurrentTime(single.time);
                setOpenCustomInput(false);
              }}
              className={
                'each-duration py-1 font-medium text-f14  transition-colors ' +
                ((HHMMToSeconds(currentTime) === singleDuration &&
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
                <EditIconSVG />
              ) : (
                single.name.map((d) => <div key={d}>{d}</div>)
              )}
            </div>
          );
        })}
      </div>
    </TimePickerBackground>
  );
};
