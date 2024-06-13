import { add } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { useUSDCapr } from '../Hooks/useUSDCapr';
import { poolsType } from '../types';
import { convertLockPeriodToSeconds } from './BoostYield/Lock';
import { DayMonthInput } from './DayMonthInput';
import { convertToNumberOfMonthsAndDays } from './BoostYield/Transactions/helpers';

export const APRheading = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  color: #7f87a7;
`;

export const APRvalue = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
`;

export const AprDD: React.FC<{
  lockPeriod: {
    days: number;
    months: number;
  };
  setLockPeriod: React.Dispatch<
    React.SetStateAction<{
      days: number;
      months: number;
    }>
  >;
  isDisabled?: boolean;
  activeChain: Chain;
  activePool: poolsType;
  minLockDuration: number;
  maxLockDuration: number;
}> = ({
  lockPeriod,
  setLockPeriod,
  isDisabled,
  activeChain,
  activePool,
  maxLockDuration,
  minLockDuration,
}) => {
  const [isAPRddOpen, setIsAPRddOpen] = useState<boolean>(false);
  const { getMultiplierByLockDuration, getLockAPR, usdcApr } = useUSDCapr(
    activeChain,
    activePool
  );
  const [value, setValue] = useState(7);

  const lockPeriodInSeconds = convertLockPeriodToSeconds(lockPeriod);
  const lockApr = getLockAPR(lockPeriodInSeconds, false);
  const multiPlier = getMultiplierByLockDuration(lockPeriodInSeconds, false);
  let factor = multiPlier;
  if (factor !== null && factor !== undefined) {
    factor = (factor + 1e4) / 1e4;
  }

  return (
    <>
      <RowBetween className="mt-6">
        <div>
          <div className="text-[#808191] text-f16 font-medium leading-[15px]">
            Lock Duration
          </div>
          <button
            onClick={() => {
              setValue(convertToNumberOfMonthsAndDays(maxLockDuration).days);
            }}
            className="bg-[#141823] text-[#FFFFFF] text-[10px] leading-[12px] font-medium py-[3px] px-[5px] rounded-sm mt-2"
          >
            Max Lock
          </button>
        </div>
        <ColumnGap gap="8px">
          <DayMonthInput
            data={lockPeriod}
            value={value}
            setValue={setValue}
            setData={setLockPeriod}
            isDisabled={isDisabled}
            activeChain={activeChain}
            minLockDuration={minLockDuration}
            maxLockDuration={maxLockDuration}
          />
          {factor === null || factor === undefined ? (
            <Skeleton
              className="w-[70px] !h-6 lc !transform-none"
              variant="rectangular"
            />
          ) : (
            <div className="text-f12 font-medium text-[#7F87A7] leading-[16px]">
              <Display
                data={lockApr}
                unit="%"
                precision={2}
                className="!inline"
              />{' '}
              Lock Bonus (x
              <Display data={factor} precision={2} className="!inline" />)
            </div>
          )}
        </ColumnGap>
      </RowBetween>

      <RowBetween className="mt-7">
        <RowGap gap="6px">
          <APRheading>Total APR</APRheading>
          <KeyboardArrowDown
            className={`text-[#ffffff] bg-[#464660] cursor-pointer transition-all duration-500 ease-in-out rounded-sm ${
              isAPRddOpen ? 'rotate-180' : ''
            }`}
            onClick={() => setIsAPRddOpen(!isAPRddOpen)}
          />
        </RowGap>
        {usdcApr && lockApr ? (
          <APRvalue>
            <Display data={add(usdcApr, lockApr)} unit="%" precision={2} />
          </APRvalue>
        ) : (
          <Skeleton
            className="w-[70px] !h-6 lc !transform-none"
            variant="rectangular"
          />
        )}
      </RowBetween>
      {isAPRddOpen && (
        <RowBetween className="mt-5">
          <APRheading>USDC APR</APRheading>
          {usdcApr ? (
            <APRvalue>
              <Display data={usdcApr} unit="%" precision={2} />
            </APRvalue>
          ) : (
            <Skeleton className="w-[70px] !h-6 lc !transform-none" />
          )}
        </RowBetween>
      )}
      {isAPRddOpen && (
        <RowBetween className="mt-4">
          <APRheading>Lock Bonus APR</APRheading>
          {lockApr ? (
            <APRvalue>
              <Display data={lockApr} unit="%" precision={2} />
            </APRvalue>
          ) : (
            <Skeleton className="w-[70px] !h-6 lc !transform-none" />
          )}
        </RowBetween>
      )}
    </>
  );
};
