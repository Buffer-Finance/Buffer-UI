import { selectedExpiry } from '@Views/AboveBelow/atoms';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useAtom } from 'jotai';
import { formatDateShort, getTimestamps } from './helpers';

export const Selector = () => {
  const [selectedTimestamp, setSelectedTimestamp] = useAtom(selectedExpiry);
  return (
    <RowGap gap="3px">
      {getTimestamps().map((timestamp) => {
        const isSelected = selectedTimestamp === timestamp;
        return (
          <button
            key={timestamp}
            onClick={() => setSelectedTimestamp(timestamp)}
            className={`px-3 py-[3px] text-f14 font-normal rounded-[6px] ${
              isSelected
                ? 'border-[1px] border-[#A3E3FF] bg-[#141823] text-1'
                : 'bg-[#282B39] text-[#C3C2D4]'
            } `}
          >
            {formatDateShort(timestamp)}
          </button>
        );
      })}
    </RowGap>
  );
};
