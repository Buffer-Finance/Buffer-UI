import { divide } from '@Utils/NumString/stringArithmatics';
import { useOneDayVolume } from '@Views/AboveBelow/Hooks/useOneDayVolume';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Display } from '@Views/Common/Tooltips/Display';
import { formatBalance } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { Skeleton } from '@mui/material';
import { getAddress } from 'viem';

export const OneDayVolume: React.FC<{
  activeMarket: marketTypeAB | undefined;
}> = ({ activeMarket }) => {
  const { oneDayVolume } = useOneDayVolume();
  if (activeMarket === undefined)
    return <Skeleton className="w-[50px] !h-5 lc " />;
  const volume = oneDayVolume?.[getAddress(activeMarket.address)];
  return (
    <Display
      data={formatBalance(
        divide(volume ?? '0', activeMarket.poolInfo.decimals) as string
      )}
      precision={2}
      unit={activeMarket.poolInfo.token}
    />
  );
};
