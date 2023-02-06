import styled from '@emotion/styled';
import { DOwnTriangle } from 'public/ComponentSVGS/DownTriangle';
import { UpTriangle } from 'public/ComponentSVGS/UpTriangle';
import { useMemo } from 'react';

const OpenUpDownBackground = styled.div<{
  upPercent: number;
  downPercent: number;
}>`
  .up-bg {
    background-color: #3fb68b;
    width: ${(props) => props.upPercent}%;
  }
  .down-bg {
    background-color: #f44336;
    width: ${(props) => props.downPercent}%;
  }
`;

export function OpenUpDownIndicator({
  openDown,
  openUp,
}: {
  openUp: number;
  openDown: number;
}) {
  const total = useMemo(() => openDown + openUp, [openDown, openUp]);
  const upPercent = useMemo(
    () => (total === 0 ? 50 : (openUp / (openUp + openDown)) * 100),
    [openDown, openUp, total]
  );
  const downPercent = useMemo(() => 100 - upPercent, [upPercent]);
  return (
    <OpenUpDownBackground downPercent={downPercent} upPercent={upPercent}>
      <div className="flex items-center w-[80%]">
        <UpTriangle className={`scale-75`} />
        <div className="text-green mr-2"> {openUp}</div>
        <div className="flex items-center w-[60%]">
          <div
            className={`h-[6px] bg-green up-bg rounded-l-sm ${
              upPercent === 100 ? 'rounded-r-sm' : ''
            }`}
          ></div>
          <div
            className={`h-[6px] bg-red down-bg rounded-r-sm ${
              downPercent === 100 ? 'rounded-l-sm' : ''
            }`}
          ></div>
        </div>
        <div className="text-red ml-2"> {openDown}</div>
        <DOwnTriangle className={`scale-75`} />
      </div>
    </OpenUpDownBackground>
  );
}
