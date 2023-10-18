import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Section } from '@Views/Earn/Components/Section';
import { useProfileGraphQl } from '@Views/Profile/Hooks/useProfileGraphQl';
import { IReferralStat } from '@Views/Referral';
import { useUserReferralStats } from '@Views/Referral/Hooks/useUserReferralStats';
import { Referral } from './ReferralCard';
import { Trading } from './TradingCard';

export const profileCardClass = 'rounded-lg px-7 !border-none';

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
