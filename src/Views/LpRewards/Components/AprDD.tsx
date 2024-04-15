import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { DayMonthInput } from './DayMonthInput';

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
}> = ({ lockPeriod, setLockPeriod, isDisabled }) => {
  const [isAPRddOpen, setIsAPRddOpen] = useState<boolean>(false);
  return (
    <>
      <RowBetween className="mt-6">
        <div>
          <div className="text-[#808191] text-f16 font-medium leading-[15px]">
            Lock Duration
          </div>
          <button
            onClick={() => {}}
            className="bg-[#141823] text-[#FFFFFF] text-[10px] leading-[12px] font-medium py-[3px] px-[5px] rounded-sm mt-2"
          >
            Max Lock
          </button>
        </div>
        <ColumnGap gap="8px">
          <DayMonthInput
            data={lockPeriod}
            setData={setLockPeriod}
            isDisabled={isDisabled}
          />
          <div className="text-f12 font-medium text-[#7F87A7] leading-[16px]">
            5.46% Lock Bonus (x1.06)
          </div>
        </ColumnGap>
      </RowBetween>

      <RowBetween className="mt-7">
        <RowGap gap="6px">
          <APRheading>Total APR</APRheading>
          <KeyboardArrowDown
            className={`text-[#ffffff] bg-[#464660] cursor-pointer transition-all duration-500 ease-in-out rounded-sm ${
              !isAPRddOpen ? 'rotate-180' : ''
            }`}
            onClick={() => setIsAPRddOpen(!isAPRddOpen)}
          />
        </RowGap>
        <APRvalue>19.49%</APRvalue>
      </RowBetween>
      {isAPRddOpen && (
        <RowBetween className="mt-5">
          <APRheading>USDC APR</APRheading>
          <APRvalue>15.49%</APRvalue>
        </RowBetween>
      )}
      {isAPRddOpen && (
        <RowBetween className="mt-4">
          <APRheading>Lock Bonus APR</APRheading>
          <APRvalue>4.00%</APRvalue>
        </RowBetween>
      )}
    </>
  );
};
