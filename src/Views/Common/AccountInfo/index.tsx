import { toFixed } from '@Utils/NumString';
import { Skeleton } from '@mui/material';
import { divide, gt, gte } from '@Utils/NumString/stringArithmatics';
import Wallet from 'public/ComponentSVGS/wallet';
import { useUserAccount } from '@Hooks/useUserAccount';

interface IAccountInfo {
  shouldDisplayString?: boolean;
  balance: string | null;
  unit: string;
}

const AccountInfo: React.FC<IAccountInfo> = ({
  balance,
  unit = 'USDC',
  shouldDisplayString = false,
}) => {
  const { address: account } = useUserAccount();

  balance = balance?.toString();
  return (
    <div
      className={`${
        shouldDisplayString
          ? ''
          : 'px-3 bg-4 special-hover hover:brightness-125'
      } flex items-center justify-start text-f13 h-[30px] w-fit rounded-[6px]`}
    >
      {!shouldDisplayString && <Wallet className="mr-[6px]" />}
      {!account || balance !== null ? (
        <div className={`${shouldDisplayString ? 'text-3' : 'text-1'} `}>
          {shouldDisplayString && 'Balance : '}
          {account
            ? balance !== null
              ? getBalance(balance, unit)
              : 'fetching balance...'
            : '-'}
        </div>
      ) : (
        <Skeleton variant="rectangular" className="lc h-[30px] w-[122px] sr" />
      )}
    </div>
  );
};

export default AccountInfo;
export const getBalance = (balance, asset = '') => {
  if (balance === null || balance === undefined) return null;
  if (balance < 0) return;
  const kBalance = divide(balance, '1000');
  const mBalance = divide(kBalance, '1000');

  if (gte(mBalance, '1')) return `${toFixed(mBalance, 2)}M ${asset}`;
  else if (gte(kBalance, '1')) return `${toFixed(kBalance, 2)}K ${asset}`;
  else return `${toFixed(balance, 1)} ${asset}`;
};
