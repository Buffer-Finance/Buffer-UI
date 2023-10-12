import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Section } from '@Views/Earn/Components/Section';
import { IReferralStat, useUserReferralStats } from '@Views/Referral';
import { useProfileGraphQl2 } from '../../Hooks/useProfileGraphQl2';
import { Referral } from './ReferralCard';
import { TradingCardV2 } from './TradingCardV2';

export const ProfileCardsV2 = () => {
  const metrics = useProfileGraphQl2();
  const { data }: { data?: IReferralStat } = useUserReferralStats();
  return (
    <Section
      Heading={<div className="text-f22">Metrics</div>}
      subHeading={<></>}
      Cards={[
        <Referral data={data} heading={'Referral Metrics'} />,
        <TradingCardV2
          data={metrics?.['USDC']}
          heading={'USDC Trading Metrics'}
          tokenName="USDC"
        />,
        <ArbitrumOnly hide>
          <TradingCardV2
            data={metrics?.['ARB']}
            heading={'ARB Trading Metrics'}
            tokenName="ARB"
          />
        </ArbitrumOnly>,
        <ArbitrumOnly hide>
          <TradingCardV2
            data={metrics?.['BFR']}
            heading={'BFR Trading Metrics'}
            tokenName="BFR"
          />
        </ArbitrumOnly>,
      ]}
      className="!mt-7"
    />
  );
};
