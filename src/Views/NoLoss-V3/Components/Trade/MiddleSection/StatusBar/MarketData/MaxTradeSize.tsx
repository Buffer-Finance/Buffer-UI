import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { Skeleton } from '@mui/material';

export const MaxTradeSize = ({
  activeMarket,
}: {
  activeMarket: InoLossMarket | undefined;
}) => {
  if (!activeMarket) return <Skeleton className="w-[80px] !h-5 lc " />;
  return (
    <Display
      data={divide(activeMarket.config.maxFee, 18)}
      // unit="Play Tokens"
      disable
    />
  );
};
