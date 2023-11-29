import { ColumnGap } from '@Views/TradePage/Components/Column';
import { Selector } from './Selector';

export const ExpiryDate = () => {
  return (
    <ColumnGap gap="4px">
      <div className="text-[#7F87A7] text-f12 font-normal">Select Expiry</div>
      <Selector />
    </ColumnGap>
  );
};
