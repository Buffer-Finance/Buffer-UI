import { Display } from '@Views/Common/Tooltips/Display';

export const CurrentPriceComponent = ({
  currentPrice,
  price_precision,
}: {
  currentPrice: number;
  price_precision: number;
}) => {
  return (
    <div className="flex items-center">
      {currentPrice ? (
        <Display data={currentPrice} label="$" precision={price_precision} />
      ) : (
        <>fetching...</>
      )}
    </div>
  );
};
