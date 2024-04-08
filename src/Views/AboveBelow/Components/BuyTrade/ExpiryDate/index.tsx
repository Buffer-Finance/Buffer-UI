import { RowBetween } from '@Views/ABTradePage/Components/Row';
import { DropDown } from './Dropdown';

export const ExpiryDate: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <RowBetween className="my-3 sm:mb-[0px]">
      <div className="text-[#7F87A7] text-f12 font-normal">
        Select Expiry (UTC)
      </div>
      {/* <Selector /> */}
      <DropDown />
    </RowBetween>
  );
};
