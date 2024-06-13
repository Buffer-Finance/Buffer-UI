import styled from '@emotion/styled';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTokensPerInterval } from '../Hooks/useTokensPerInterval';
import { Chain } from 'viem';
import { convertLockPeriodToSeconds } from './BoostYield/Lock';
import { atom, useAtom } from 'jotai';
function formatDays(data) {
  return data.months * 30 + data.days;
}
export const lockErrorAtom = atom<string>('');
export const DayMonthInput: React.FC<{
  data: {
    days: number;
    months: number;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      days: number;
      months: number;
    }>
  >;
  isDisabled?: boolean;
  activeChain: Chain;
  minLockDuration: number;
  maxLockDuration: number;
  value: any;
  setValue: any;
}> = ({
  data,
  setData,
  isDisabled,
  activeChain,
  maxLockDuration,
  minLockDuration,
  value,
  setValue,
}) => {
  const [error, setError] = useAtom(lockErrorAtom);

  const handleSubtract = useCallback(() => {
    setError('');

    setValue(value - 1);
  }, [setData, data]);

  const handleAdd = useCallback(() => {
    setError('');

    setValue(value + 1);
  }, [setData, data]);

  const isMinusDisabled = useMemo(() => {
    if (isDisabled) return true;
    if (data.days === 0 && data.months === 0) return true;

    if (minLockDuration < convertLockPeriodToSeconds(data)) return false;
    return true;
  }, [data, minLockDuration, isDisabled]);

  const isPlusDisabled = useMemo(() => {
    if (isDisabled) return true;
    if (maxLockDuration > convertLockPeriodToSeconds(data)) return false;
    return true;
  }, [data, maxLockDuration, isDisabled]);
  const detectError = (val: number | string) => {
    if (val == '' || parseInt(val) < 7) {
      setError('Minimum lock period is 7 days');
      // setData({ days: 7, months: 0 });
    } else if (parseInt(val) > 90) {
      setError('Maximum lock period is 90 days');
      // setData({ days: 90, months: 0 });
    } else {
      setError('');
    }
  };
  useEffect(() => {
    if (!error) setData((p) => ({ ...data, days: value }));
  }, [value, error]);
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 justify-end">
        <ActionButton onClick={handleSubtract} disabled={isMinusDisabled}>
          -
        </ActionButton>
        <div className="flex items-center gap-3 ">
          <div>
            <div className="text-[#C3C2D4] text-f12 font-medium leading-[18px]">
              Days
            </div>
            <input
              className="text-[#ffffff] bg-transparent  outline-none border-none w-[30px] text-f16 font-medium leading-[18px] mt-3 text-center"
              value={value}
              type="number"
              onChange={(e) => {
                setValue(parseInt(e.target.value));
                detectError(e.target.value);
              }}
            />
          </div>
        </div>
        <ActionButton onClick={handleAdd} disabled={isPlusDisabled}>
          +
        </ActionButton>
      </div>
      {error ? <div className="text-red font-medium">{error}</div> : null}
    </div>
  );
};

const ActionButton = styled.button`
  background-color: #464660;
  font-size: 24px;
  font-weight: 900;
  padding: 8px;
  border-radius: 6px;
  color: #ffffff;
  width: fit-content;
  height: fit-content;
  line-height: 12px;
  padding-bottom: 9px;

  :disabled {
    background-color: #272740;
    color: #464660;
    cursor: not-allowed;
  }
`;
