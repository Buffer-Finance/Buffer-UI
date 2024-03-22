import { useUserAccount } from '@Hooks/useUserAccount';
import { divide, gte } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { ItradingMetricsData } from '@Views/Profile/Hooks/useProfileGraphQl';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { profileCardClass } from './ProfileCards';
import { WalletNotConnectedCard } from './WalletNotConnectedCard';

export const Trading = ({
  data,
  heading,
  tokenName = 'BFR',
}: {
  data: ItradingMetricsData | null;
  heading: string;
  tokenName?: string;
}) => {
  const { address: account } = useUserAccount();
  const alldecimals = useDecimalsByAsset();
  const decimals = alldecimals[tokenName];
  if (account === undefined)
    return <WalletNotConnectedCard heading={heading} />;

  if (data === null)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      className={profileCardClass}
      shouldShowDivider={false}
      top={heading}
      middle={
        <TableAligner
          className="mt-3"
          keyStyle={keyClasses + ' !text-[#7F87A7] !text-f16'}
          valueStyle={valueClasses + ' !text-f16'}
          keysName={['Total Payout', 'Net PnL', 'Open Interest', 'Volume']}
          values={[
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalPayouts[tokenName] ?? '0', decimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                className={
                  data && gte(data.net_pnl[tokenName] ?? '0', '0')
                    ? 'text-green'
                    : 'text-red'
                }
                data={divide(data.net_pnl[tokenName] ?? '0', decimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.openInterest[tokenName] ?? '0', decimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.volume[tokenName] ?? '0', decimals)}
                unit={tokenName}
              />
            </div>,
          ]}
        />
      }
    />
  );
};
