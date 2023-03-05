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
  const total = useMemo(() => openUp + openDown, [openDown, openUp]);
  const upPercent = useMemo(
    () => (total === 0 ? 50 : (openUp / (openUp + openDown)) * 100),
    [openDown, openUp, total]
  );
  const downPercent = useMemo(() => 100 - upPercent, [upPercent]);
  return (
    <OpenUpDownBackground downPercent={downPercent} upPercent={upPercent}>
      <div className="flex flex-col items-start gap-2">
        <div className="flex justify-between w-[80%]">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <UpTriangle className={`scale-75`} />
            <div className="text-green mr-2 whitespace-nowrap">
              {' '}
              {openUp} USDC
            </div>
          </div>

          <div className="flex items-center gap-1 whitespace-nowrap">
            <div className="text-red ml-2 whitespace-nowrap">
              {' '}
              {openDown} USDC
            </div>
            <DOwnTriangle className={`scale-75`} />
          </div>
        </div>
        <div className="flex items-center w-[80%] ">
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
      </div>
    </OpenUpDownBackground>
  );
}
