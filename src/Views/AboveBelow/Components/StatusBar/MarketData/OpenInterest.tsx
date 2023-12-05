import { divide } from '@Utils/NumString/stringArithmatics';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Display } from '@Views/Common/Tooltips/Display';
import { formatBalance } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { Skeleton } from '@mui/material';

export const OpenInterest: React.FC<{
  activeMarket: marketTypeAB | undefined;
}> = ({ activeMarket }) => {
  if (activeMarket === undefined)
    return <Skeleton className="w-[50px] !h-5 lc " />;

  return (
    <>
      <Display
        data={formatBalance(
          divide(
            activeMarket.openInterestUp ?? '0',
            activeMarket.poolInfo.decimals
          ) as string
        )}
        precision={2}
        disable
        className="!justify-start !inline"
      />
      /
      <Display
        data={formatBalance(
          divide(
            activeMarket.openInterestDown ?? '0',
            activeMarket.poolInfo.decimals
          ) as string
        )}
        precision={2}
        disable
        className="!justify-start !inline"
      />{' '}
      {activeMarket.poolInfo.token}
    </>
  );
};
