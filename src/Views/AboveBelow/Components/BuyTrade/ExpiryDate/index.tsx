import { RowBetween } from '@Views/ABTradePage/Components/Row';
import { DropDown } from './Dropdown';
import { isExpiryStale } from '@TV/utils';
import { useAtomValue } from 'jotai';
import { selectedExpiry } from '@Views/AboveBelow/atoms';
import InfoIcon from '@SVG/Elements/InfoIcon';

export const ExpiryDate: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const selectedTimestamp = useAtomValue(selectedExpiry);

  return (
    <RowBetween className="my-3 sm:mb-[0px]">
      <div className="text-[#7F87A7] text-f12 font-normal">
        Select Expiry (UTC)
        {isExpiryStale(selectedTimestamp) ? (
          <div className="text-red text-f10 flex items-center">
            Selected expiry is invalid, please resect.
          </div>
        ) : null}
      </div>
      {/* <Selector /> */}
      <DropDown />
    </RowBetween>
  );
};
