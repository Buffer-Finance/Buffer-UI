import { divide } from '@Utils/NumString/stringArithmatics';
import { RowGap } from '@Views/ABTradePage/Components/Row';

export const StrikePrice: React.FC<{ slippage: number; strike: string }> = ({
  slippage,
  strike,
}) => {
  return (
    <RowGap gap="4px">
      <div className="text-1">{strike}</div>
      <RowGap gap="4px" className="text-[10px]">
        <svg
          width="4"
          height="6"
          viewBox="0 0 4 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.08 5.624C0.0266667 5.624 0 5.59733 0 5.544V5.08C0 5.02667 0.0266667 5 0.08 5H3.63274C3.68607 5 3.71274 5.02667 3.71274 5.08V5.544C3.71274 5.59733 3.68607 5.624 3.63274 5.624H0.08Z"
            fill="#6F6E84"
          />
          <path
            d="M1.536 3.536C1.48267 3.536 1.456 3.50933 1.456 3.456V2.08H0.08C0.0266667 2.08 0 2.05333 0 2V1.536C0 1.48267 0.0266667 1.456 0.08 1.456H1.456V0.0799999C1.456 0.0266666 1.48267 0 1.536 0H2C2.05333 0 2.08 0.0266666 2.08 0.0799999V1.456H3.57862C3.63196 1.456 3.65862 1.48267 3.65862 1.536V2C3.65862 2.05333 3.63196 2.08 3.57862 2.08H2.08V3.456C2.08 3.50933 2.05333 3.536 2 3.536H1.536Z"
            fill="#6F6E84"
          />
        </svg>

        <span>{divide(slippage, 2)}%</span>
      </RowGap>
    </RowGap>
  );
};
