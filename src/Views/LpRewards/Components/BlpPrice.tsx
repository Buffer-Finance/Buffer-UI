import { divide } from '@Utils/NumString/stringArithmatics';
import { Skeleton } from '@mui/material';
import { Chain } from 'viem';
import { useBlpRate } from '../Hooks/useBlpRate';
import { poolsType } from '../types';

export const BLPprice: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
}> = ({ activeChain, activePool }) => {
  const { data: blpPrice, error: blpPriceError } = useBlpRate(
    activeChain,
    activePool
  );
  if (blpPrice === undefined && blpPriceError === undefined) {
    return (
      <Skeleton className="w-[50px] !h-5 lc inline" variant="rectangular" />
    );
  } else if (blpPriceError) {
    return <span>0.00 </span>;
  } else if (blpPrice !== undefined) {
    return <span>{divide(blpPrice.price, 8)}&nbsp;</span>;
  } else {
    return <span>0.00 </span>;
  }
};
