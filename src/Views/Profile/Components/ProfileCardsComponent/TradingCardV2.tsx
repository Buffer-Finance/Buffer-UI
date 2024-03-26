import { useUserAccount } from '@Hooks/useUserAccount';
import { divide, gte } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { TokenWiseData } from '@Views/Profile/Hooks/useProfileGraphQl2';
import { useDecimalsByAsset } from '@Views/ABTradePage/Hooks/useDecimalsByAsset';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { profileCardClass } from './ProfileCards';
import { WalletNotConnectedCard } from './WalletNotConnectedCard';

export const TradingCardV2 = ({
  data,
  tokenName,
  heading,
}: {
  data: TokenWiseData | undefined;
  tokenName: string;
  heading: string;
}) => {
  const { address: account } = useUserAccount();
  const alldecimals = useDecimalsByAsset();
  const decimals = alldecimals[tokenName];
  if (account === undefined)
    return <WalletNotConnectedCard heading={heading} />;

  if (data === undefined)
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
              <Display data={divide(data.payout, decimals)} unit={tokenName} />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.netPnl, decimals)}
                unit={tokenName}
                className={
                  data && gte(data.netPnl ?? '0', '0')
                    ? 'text-green'
                    : 'text-red'
                }
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.openInterest, decimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display data={divide(data.volume, decimals)} unit={tokenName} />
            </div>,
          ]}
        />
      }
    />
  );
};
