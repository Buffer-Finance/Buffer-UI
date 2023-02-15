import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { Section } from '@Views/Earn/Components/Section';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';

export const ProfileCards = () => {
  return (
    <Section
      Heading={<div className="text-f22">Metrics</div>}
      subHeading={<></>}
      Cards={[<Trading data={null} />, <Referral data={null} />]}
    />
  );
};

const Trading = ({ data }: { data: any }) => {
  // if (!data)
  //   return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
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
              <Display data={'10000'} unit={'USDC'} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'75'} unit={'%'} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'56'} unit={'%'} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'50000'} unit={'USDC'} />
            </div>,
          ]}
        />
      }
    />
  );
};
const Referral = ({ data }: { data: any }) => {
  // if (!data)
  //   return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
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
              <Display data={'10000'} unit={'USDC'} />
            </div>,
            // <div className={wrapperClasses}>
            //   <img src={`/LeaderBoard/${'Diamond'}.png`} className="w-5 mr-2" />{' '}
            // </div>,
            <div className={wrapperClasses}>
              <Display data={'10000'} unit={'USDC'} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'50000'} unit={'USDC'} />
            </div>,
          ]}
        />
      }
    />
  );
};
