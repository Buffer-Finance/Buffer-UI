import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { formatBalance } from '@Views/ABTradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { Skeleton } from '@mui/material';
import { getAddress } from 'viem';

export const OneDayVolume: React.FC<{
  activeMarket: marketTypeAB | undefined;
  oneDayVolume: {
    [key: string]: string;
  };
}> = ({ activeMarket, oneDayVolume }) => {
  if (activeMarket === undefined || oneDayVolume === undefined)
    return <Skeleton className="w-[50px] !h-5 lc " />;
  const volume = oneDayVolume[getAddress(activeMarket.address)];
  return (
    <div>
      {toFixed(
        formatBalance(
          divide(volume ?? '0', activeMarket.poolInfo.decimals) as string
        ),
        2
      )}
      &nbsp;
      {activeMarket.poolInfo.token}
    </div>
  );
};
