import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { formatBalance } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { Skeleton } from '@mui/material';

export const OpenInterest: React.FC<{
  activeMarket: marketTypeAB | undefined;
}> = ({ activeMarket }) => {
  if (activeMarket === undefined)
    return <Skeleton className="w-[50px] !h-5 lc " />;

  return (
    <>
      <span>
        {toFixed(
          formatBalance(
            divide(
              activeMarket.openInterestUp ?? '0',
              activeMarket.poolInfo.decimals
            ) as string
          ),
          2
        )}
      </span>
      /
      <span>
        {toFixed(
          formatBalance(
            divide(
              activeMarket.openInterestDown ?? '0',
              activeMarket.poolInfo.decimals
            ) as string
          ),
          2
        )}
      </span>
      {activeMarket.poolInfo.token}
    </>
  );
};
