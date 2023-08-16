import { useUserAccount } from '@Hooks/useUserAccount';
import { Skeleton } from '@mui/material';
import { divide, gte } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { Section } from '@Views/Earn/Components/Section';
import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { IReferralStat, useUserReferralStats } from '@Views/Referral';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import {
  ItradingMetricsData,
  useProfileGraphQl,
} from '../Hooks/useProfileGraphQl';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { toFixed } from '@Utils/NumString';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { useMemo } from 'react';

const profileCardClass = 'rounded-lg px-7 !border-none';

export const ProfileCards = () => {
  const { tradingMetricsData } = useProfileGraphQl();
  const { data }: { data?: IReferralStat } = useUserReferralStats();

  return (
    <Section
      Heading={<div className="text-f22">Metrics</div>}
      subHeading={<></>}
      Cards={[
        <Referral data={data} heading={'Referral Metrics'} />,
        <Trading
          data={tradingMetricsData}
          heading={'USDC Trading Metrics'}
          tokenName="USDC"
        />,
        <ArbitrumOnly hide>
          <Trading
            data={tradingMetricsData}
            heading={'ARB Trading Metrics'}
            tokenName="ARB"
          />
        </ArbitrumOnly>,
        <ArbitrumOnly hide>
          <Trading
            data={tradingMetricsData}
            heading={'BFR Trading Metrics'}
            tokenName="BFR"
          />
        </ArbitrumOnly>,
      ]}
      className="!mt-7"
    />
  );
};

const Trading = ({
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

const Referral = ({
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

export const WalletNotConnectedCard = ({ heading }: { heading: string }) => (
  <Card
    top={heading}
    middle={<div className="mt-3">Wallet not connected.</div>}
    className={profileCardClass}
    shouldShowDivider={false}
  />
);
