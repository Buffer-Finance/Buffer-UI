import { round } from '@Utils/NumString/stringArithmatics';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Display } from '@Views/Common/Tooltips/Display';
import { setDoccumentTitle } from '@Views/TradePage/utils/setDocumentTitle';
import { Skeleton } from '@mui/material';

export const ActiveMarketPrice: React.FC<{
  market: marketTypeAB | undefined;
}> = ({ market }) => {
  const { price, precision } = useMarketPrice(market?.tv_id);
  const precisePrice = price ? round(price, precision) : null;
  const title = price ? precisePrice + ' | ' + market?.tv_id : '';
  setDoccumentTitle(title || 'Buffer Finance');
  if (market === undefined || !price)
    return <Skeleton className="w-[100px] !h-7 lc " />;

  return (
    <div className="text-f18 b1200:text-f12">
      <Display
        className="!justify-start"
        data={round(price, precision)}
        precision={precision}
      />
    </div>
  );
};
