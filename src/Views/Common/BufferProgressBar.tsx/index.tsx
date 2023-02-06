import styled from "@emotion/styled";
import * as React from "react";
import { toFixed } from "@Utils/NumString";

const ProgressbarBackground = styled.div<{ barWidth; fontSize }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  font-size: ${(props) => props.fontSize}px;
  .bar-width {
    width: ${(props) => props.barWidth};
  }
`;

const BufferProgressBar = ({
  progressPercent,
  fontSize = 12,
}: {
  progressPercent: number;
  fontSize?: number;
}) => {
  return (
    <ProgressbarBackground barWidth={`${progressPercent}%`} fontSize={fontSize}>
      <div className="w-full relative h-[6px]">
        <div className="relative rounded-full h-full w-full bg-[#2a2a3a]"></div>
        <div className="absolute top-[0] left-[0] rounded-full bg-blue h-full bar-width"></div>
      </div>
      <div>{toFixed(progressPercent, 2)}%</div>
    </ProgressbarBackground>
  );
};

export { BufferProgressBar };
