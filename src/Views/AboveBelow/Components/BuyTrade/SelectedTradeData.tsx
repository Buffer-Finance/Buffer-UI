import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import { Display } from '@Views/Common/Tooltips/Display';
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
    <span className="text-[#7F87A7] text-f13 mt-3">
      {activeMarket.token0}/{activeMarket.token1} will be{' '}
      {selectedPrice[activeMarket.tv_id].isAbove ? 'above' : 'below'}{' '}
      <span className="text-1">
        <Display
          data={selectedPrice[activeMarket.tv_id].price}
          precision={activeMarket.price_precision.toString().length - 1}
          disable
          className="!inline"
        />
      </span>{' '}
      on <span className="text-1">{getDisplayDate(expiryDateTimeStamp)}</span>{' '}
      at <span className="text-1">{getDisplayTime(expiryDateTimeStamp)}</span>
    </span>
  );
};
