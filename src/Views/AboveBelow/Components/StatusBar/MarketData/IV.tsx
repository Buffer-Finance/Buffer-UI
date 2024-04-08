import { useIV } from '@Views/AboveBelow/Hooks/useIV';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { Skeleton } from '@mui/material';

export const IV: React.FC<{ activeMarket: marketTypeAB | undefined }> = ({
  activeMarket,
}) => {
  const { data: ivs } = useIV();

  if (activeMarket === undefined || !ivs)
    return <Skeleton className="w-[20px] !h-5 lc " />;
  const iv = ivs[activeMarket.tv_id];
  if (iv === undefined) return <Skeleton className="w-[20px] !h-5 lc " />;
  return <>{iv / 1e2}%</>;
};

export const IVMobile: React.FC<{ activeMarket: marketTypeAB | undefined }> = ({
  activeMarket,
}) => {
  const { data: ivs } = useIV();

  if (activeMarket === undefined || !ivs)
    return <Skeleton className="w-[20px] !h-5 lc " />;
  const iv = ivs[activeMarket.tv_id];
  if (iv === undefined) return <Skeleton className="w-[20px] !h-5 lc " />;
  return <>{(iv / 1e2).toFixed(0)}%</>;
};
