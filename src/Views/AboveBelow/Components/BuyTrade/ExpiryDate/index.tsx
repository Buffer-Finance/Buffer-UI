import { RowBetween } from '@Views/TradePage/Components/Row';
import { DropDown } from './Dropdown';

export const ExpiryDate: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <RowBetween>
      <div className="text-[#7F87A7] text-f12 font-normal">Select Expiry</div>
      {/* <Selector /> */}
      <DropDown />
    </RowBetween>
  );
};
