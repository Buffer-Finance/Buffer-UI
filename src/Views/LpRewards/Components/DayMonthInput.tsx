import styled from '@emotion/styled';
import { useCallback } from 'react';

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
}> = ({ data, setData }) => {
  const handleSubtract = useCallback(() => {
    if (data.days > 0) {
      setData((prev) => ({ ...prev, days: prev.days - 1 }));
    } else if (data.months > 0) {
      setData((prev) => ({ ...prev, days: 30, months: prev.months - 1 }));
    }
  }, [setData, data]);

  const handleAdd = useCallback(() => {
    if (data.days < 30) {
      setData((prev) => ({ ...prev, days: prev.days + 1 }));
    } else {
      setData((prev) => ({ ...prev, days: 0, months: prev.months + 1 }));
    }
  }, [setData, data]);

  return (
    <div className="flex items-center gap-3">
      <ActionButton onClick={handleSubtract}>-</ActionButton>
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[#C3C2D4] text-f12 font-medium leading-[18px]">
            Months
          </div>
          <div className="text-[#ffffff] text-f16 font-medium leading-[18px] mt-3 text-center">
            {data.months}
          </div>
        </div>
        <div>
          <div className="text-[#C3C2D4] text-f12 font-medium leading-[18px]">
            Days
          </div>
          <div className="text-[#ffffff] text-f16 font-medium leading-[18px] mt-3 text-center">
            {data.days}
          </div>
        </div>
      </div>
      <ActionButton onClick={handleAdd}>+</ActionButton>
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
`;
