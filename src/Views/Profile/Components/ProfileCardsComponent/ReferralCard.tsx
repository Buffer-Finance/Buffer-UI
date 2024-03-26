import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { IReferralStat } from '@Views/Referral';
import { useDecimalsByAsset } from '@Views/ABTradePage/Hooks/useDecimalsByAsset';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { profileCardClass } from './ProfileCards';
import { WalletNotConnectedCard } from './WalletNotConnectedCard';

export const Referral = ({
  data,
  heading,
}: {
  data: IReferralStat | undefined;
  heading: string;
}) => {
  const { address: account } = useUserAccount();
  const alldecimals = useDecimalsByAsset();
  const usdcDecimals = alldecimals['USDC'];
  const poolNames = usePoolNames();
  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );
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
          keysName={[
            'Total Referral Earnings',
            'Referred Trading Volume',
            'Referred # of Trades',
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalRebateEarned, usdcDecimals)}
                unit={'USDC'}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) => {
                        const decimals = alldecimals[token];
                        return (
                          toFixed(
                            divide(
                              data[`totalRebateEarned${token}`],
                              decimals
                            ) as string,
                            2
                          ) +
                          ' ' +
                          token
                        );
                      })}
                    />
                  )
                }
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalVolumeOfReferredTrades, usdcDecimals)}
                unit={'USDC'}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) => {
                        const decimals = alldecimals[token];

                        return (
                          toFixed(
                            divide(
                              data[`totalVolumeOfReferredTrades${token}`],
                              decimals
                            ) as string,
                            2
                          ) +
                          ' ' +
                          token
                        );
                      })}
                    />
                  )
                }
              />
            </div>,

            <div className={wrapperClasses}>
              <Display
                data={data?.totalTradesReferred}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map(
                        (token) => data[`totalTradesReferred${token}`]
                      )}
                    />
                  )
                }
              />
            </div>,
          ]}
        />
      }
    />
  );
};
