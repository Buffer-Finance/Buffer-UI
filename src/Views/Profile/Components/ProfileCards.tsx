import { useActiveChain } from '@Hooks/useActiveChain';
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
import { usePoolNames } from '@Views/Dashboard/Hooks/useArbitrumOverview';
import { toFixed } from '@Utils/NumString';

const profileCardClass = 'rounded-lg px-7';

export const ProfileCards = () => {
  const { tradingMetricsData } = useProfileGraphQl();
  const { data }: { data?: IReferralStat } = useUserReferralStats();

  return (
    <Section
      Heading={<div className="text-f22">Metrics</div>}
      subHeading={<></>}
      Cards={[
        <Trading
          data={tradingMetricsData}
          heading={'Trading Metrics USDC'}
          tokenName="USDC"
        />,
        <Trading
          data={tradingMetricsData}
          heading={'Trading Metrics ARB'}
          tokenName="ARB"
        />,
        <Referral data={data} heading={'Referral Metrics'} />,
      ]}
      className="!mt-7"
    />
  );
};

const Trading = ({
  data,
  heading,
  tokenName,
}: {
  data: ItradingMetricsData | null;
  heading: string;
  tokenName: string;
}) => {
  const { address: account } = useUserAccount();
  const { configContracts } = useActiveChain();
  const usdcDecimals = configContracts.tokens[tokenName].decimals;

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
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['Total Payout', 'Net PnL', 'Open Interest', 'Volume']}
          values={[
            <div className={wrapperClasses}>
              <Display
                data={divide(data[`${tokenName}totalPayout`], usdcDecimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                className={
                  data && gte(data[`${tokenName}net_pnl`], '0')
                    ? 'text-green'
                    : 'text-red'
                }
                data={divide(data[`${tokenName}net_pnl`], usdcDecimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data[`${tokenName}openInterest`], usdcDecimals)}
                unit={tokenName}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data[`${tokenName}volume`], usdcDecimals)}
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
  const { configContracts } = useActiveChain();
  const usdcDecimals = configContracts.tokens['USDC'].decimals;
  const { poolNames: tokens } = usePoolNames();

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
          keyStyle={keyClasses}
          valueStyle={valueClasses}
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
                className="!w-full !justify-end"
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) =>
                        toFixed(
                          divide(
                            data[`totalRebateEarned${token}`],
                            configContracts.tokens[token].decimals
                          ) as string,
                          2
                        )
                      )}
                    />
                  )
                }
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalVolumeOfReferredTrades, usdcDecimals)}
                unit={'USDC'}
                className="!w-full !justify-end"
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) =>
                        toFixed(
                          divide(
                            data[`totalVolumeOfReferredTrades${token}`],
                            configContracts.tokens[token].decimals
                          ) as string,
                          2
                        )
                      )}
                    />
                  )
                }
              />
            </div>,

            <div className={wrapperClasses}>
              <Display
                data={data?.totalTradesReferred}
                className="!w-full !justify-end"
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
