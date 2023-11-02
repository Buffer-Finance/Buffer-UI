import { divide } from '@Utils/NumString/stringArithmatics';
import { noLossReadCallsReadOnlyAtom } from '@Views/NoLoss-V3/atoms';
import { formatBalance } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
export const Balance = () => {
  const { result: readCallResults } = useAtomValue(noLossReadCallsReadOnlyAtom);
  const balance = readCallResults?.activeTournamentBalance;

  if (balance === undefined) return <Skeleton className="w-[40px] !h-5 lc " />;
  return <>{formatBalance(divide(balance, 18) as string)} </>;
};
