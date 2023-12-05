import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import { useAtomValue } from 'jotai';

export const SelectedTradeData = () => {
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const selectedPrice = useAtomValue(selectedPriceAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);

  if (!selectedTimestamp || !selectedPrice || !activeMarket) return <></>;
  const selectedPriceValue = selectedPrice[activeMarket.tv_id];
  if (!selectedPriceValue) return <></>;
  const expiryDateTimeStamp = Math.floor(selectedTimestamp / 1000);
  return (
    <span className="text-[#7F87A7] text-f14 mt-3">
      {activeMarket.token0}/{activeMarket.token1} will be{' '}
      {selectedPrice[activeMarket.tv_id].isAbove ? 'above' : 'below'}{' '}
      <span className="text-1">{selectedPrice[activeMarket.tv_id].price}</span>{' '}
      at <span className="text-1">{getDisplayDate(expiryDateTimeStamp)}</span>{' '}
      {getDisplayTime(expiryDateTimeStamp)}.
    </span>
  );
};
