import styled from '@emotion/styled';
import { toFixed } from '@Utils/NumString';

const ProgressbarBackground = styled.div<{
  barWidth: string;
  fontSize: number;
  color1: string;
  color2: string;
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: ${(props) => props.fontSize}px;
  .bar-width {
    width: ${(props) => props.barWidth};
  }
  .color1 {
    background-color: ${(props) => props.color1};
  }
  .color2 {
    background-color: ${(props) => props.color2};
  }
`;

const TwoColorProgressBar = ({
  progressPercent,
  fontSize = 12,
  color2 = '#2a2a3a',
  color1 = 'blue',
  hidePercent = false,
}: {
  progressPercent: number | undefined;
  fontSize?: number;
  color1?: string;
  color2?: string;
  hidePercent?: boolean;
}) => {
  return (
    <ProgressbarBackground
      barWidth={`${progressPercent}%`}
      fontSize={fontSize}
      color1={progressPercent === undefined ? '#2a2a3a' : color1}
      color2={progressPercent === undefined ? '#2a2a3a' : color2}
    >
      <div className="w-full relative h-[6px]">
        <div className={`relative rounded-full h-full w-full color1`}></div>
        <div
          className={`absolute top-[0] left-[0] rounded-full color2 h-full bar-width`}
        ></div>
      </div>
      {!hidePercent && <div>{toFixed(progressPercent ?? 0, 2)}%</div>}
    </ProgressbarBackground>
  );
};

export { TwoColorProgressBar };
