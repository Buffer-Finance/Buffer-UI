import { toFixed } from '@Utils/NumString';
import { add, divide, multiply } from '@Utils/NumString/stringArithmatics';
import { marketTypeAB } from '@Views/AboveBelow/types';
import NumberTooltip from '@Views/Common/Tooltips';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { TwoColorProgressBar } from './TwoColorProgressBar';
import React from 'react';

export const OpenInteres: React.FC<{
  activeMarket: marketTypeAB | undefined;
}> = ({ activeMarket }) => {
  console.log(`OpenInterest-activeMarket: `, activeMarket);
  if (activeMarket === undefined)
    return <Skeleton className="w-[50px] !h-5 lc " />;

  const openInterestUp = divide(
    activeMarket.openInterestUp,
    activeMarket.poolInfo.decimals
  ) as string;
  const openInterestDown = divide(
    activeMarket.openInterestDown,
    activeMarket.poolInfo.decimals
  ) as string;
  console.log(`OpenInterest-openInterestDown: `, openInterestDown);
  const totalOpenInterest = add(openInterestUp, openInterestDown);

  const openInterestUpPercent =
    totalOpenInterest === '0'
      ? undefined
      : +multiply(divide(openInterestUp, totalOpenInterest) as string, '100');

  const openInterestDownPercent =
    openInterestUpPercent === undefined
      ? undefined
      : 100 - openInterestUpPercent;

  const unit = activeMarket.poolInfo.token;

  return (
    <div className="w-[100px] mb-2 mt-[6px]">
      <NumberTooltip
        content={
          <TableAligner
            className=""
            keyStyle="text-1 !text-f12 !p-3"
            valueStyle="text-1 !text-f12 !p-3"
            keysName={['Long Open Interest', 'Short Open Interest']}
            values={[
              <div className="flex flex-col">
                <span>
                  {toFixed(openInterestUp, 2)} {unit}
                </span>
                <span>({openInterestUpPercent?.toFixed(2) ?? 0}%)</span>
              </div>,
              <div className="flex flex-col">
                <span>
                  {toFixed(openInterestDown, 2)} {unit}
                </span>
                <span>({openInterestDownPercent?.toFixed(2) ?? 0}%)</span>
              </div>,
            ]}
          />
        }
      >
        <div>
          <TwoColorProgressBar
            hidePercent
            progressPercent={openInterestUpPercent}
            color1="#D34A4A"
            color2="#3FB68B"
          />
        </div>
      </NumberTooltip>
    </div>
  );
};

export const OpenInterest = React.memo(OpenInteres);
