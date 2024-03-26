import styled from '@emotion/styled';
import { toFixed } from '@Utils/NumString';

const TimeElapsedBarBackground = styled.div<{ barWidth: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  .bar-width {
    width: ${(props) => props.barWidth};
  }
`;

const TimeElapsedBar = ({ progressPercent }: { progressPercent: number }) => {
  return (
    <TimeElapsedBarBackground barWidth={`${progressPercent}%`}>
      <div className="w-full relative h-[2px]">
        <div className="relative rounded-full h-full w-full bg-[#393D4D]"></div>
        <div className="absolute top-[0] left-[0] rounded-full bg-[#3FB68B] h-full bar-width"></div>
      </div>{' '}
    </TimeElapsedBarBackground>
  );
};

export { TimeElapsedBar };
