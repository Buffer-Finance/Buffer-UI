import { Skeleton } from '@mui/material';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { Section } from '@Views/Earn/Components/Section';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { IReferralStat, useUserReferralStats } from '@Views/Referral';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { usdcDecimals } from '@Views/V2-Leaderboard/Incentivised';
import {
  ItradingMetricsData,
  useProfileGraphQl,
} from '../Hooks/useProfileGraphQl';

export const ProfileCards = () => {
  const { tradingMetricsData } = useProfileGraphQl();
  const { data }: { data?: IReferralStat } = useUserReferralStats();

  return (
    <Section
      Heading={<div className="text-f22">Metrics</div>}
      subHeading={<></>}
      Cards={[<Trading data={tradingMetricsData} />, <Referral data={data} />]}
    />
  );
};

const Trading = ({ data }: { data: ItradingMetricsData | null }) => {
  if (data === null)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      top={'Trading Metrics'}
      middle={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['Total Payout', 'Win Rate', 'Open Interest', 'Volume']}
          values={[
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalPayout, usdcDecimals)}
                unit={'USDC'}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={(data.tradeWon * 100) / data.totalTrades}
                unit={'%'}
                content={
                  <>{`Won ${data.tradeWon}/${data.totalTrades} trades.`}</>
                }
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.openInterest, usdcDecimals)}
                unit={'USDC'}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display data={divide(data.volume, usdcDecimals)} unit={'USDC'} />
            </div>,
          ]}
        />
      }
    />
  );
};

const Referral = ({ data }: { data: IReferralStat | undefined }) => {
  if (data === undefined)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      top={'Referral Metrics'}
      middle={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={[
            'Total Referral Earnings',
            // 'Referral Tier',
            'Referred Trading Volume',
            'Referred # of Trades',
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalVolumeOfReferredTrades, usdcDecimals)}
                unit={'USDC'}
              />
            </div>,
            // <div className={wrapperClasses}>
            //   <img src={`/LeaderBoard/${'Diamond'}.png`} className="w-5 mr-2" />{' '}
            // </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalRebateEarned, usdcDecimals)}
                unit={'USDC'}
              />
            </div>,
            <div className={wrapperClasses}>{data.totalTradesReferred}</div>,
          ]}
        />
      }
    />
  );
};
