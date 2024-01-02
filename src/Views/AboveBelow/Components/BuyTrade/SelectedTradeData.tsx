import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
} from '@Views/AboveBelow/atoms';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Display } from '@Views/Common/Tooltips/Display';
import { useAtomValue } from 'jotai';

export const SelectedTradeData = () => {
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);

  if (!activeMarket) return <></>;
  return (
    <span className="text-[#7F87A7] text-f13 mt-3">
      {activeMarket.token0}/{activeMarket.token1} will be&nbsp;
      <PriceData activeMarket={activeMarket} />
      &nbsp;on&nbsp;
      <DateData />
    </span>
  );
};

const PriceData: React.FC<{ activeMarket: marketTypeAB }> = ({
  activeMarket,
}) => {
  const selectedPrice = useAtomValue(selectedPriceAtom);
  const priceObj = selectedPrice?.[activeMarket.tv_id];
  if (priceObj === undefined)
    return <span className="text-1">( pick a price )</span>;
  return (
    <span>
      {priceObj.isAbove ? 'above' : 'below'}&nbsp;
      <span className="text-1">
        <Display
          data={priceObj.price}
          precision={activeMarket.price_precision.toString().length - 1}
          disable
          className="!inline"
        />
      </span>
    </span>
  );
};

const DateData = () => {
  const selectedTimestamp = useAtomValue(selectedExpiry);
  if (selectedTimestamp === undefined)
    return <span className="text-1">( pick a date )&nbsp;</span>;
  const expiryDateTimeStamp = Math.floor(selectedTimestamp / 1000);

  return (
    <span>
      <span className="text-1">{getDisplayDate(expiryDateTimeStamp)}</span>{' '}
      at&nbsp;
      <span className="text-1">{getDisplayTime(expiryDateTimeStamp)}</span>
    </span>
  );
};
