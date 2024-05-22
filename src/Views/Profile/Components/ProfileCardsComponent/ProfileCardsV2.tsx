import { ArbitrumOnly } from '@Views/Common/ChainNotSupported';
import { Section } from '@Views/Earn/Components/Section';
import { IReferralStat } from '@Views/Referral';
import { useUserReferralStats } from '@Views/Referral/Hooks/useUserReferralStats';
import { useProfileGraphQl2 } from '../../Hooks/useProfileGraphQl2';
import { Referral } from './ReferralCard';
import { TradingCardV2 } from './TradingCardV2';
import { ProductDropDown, Products } from '../ProductDropDown';
import { useState } from 'react';

export const ProfileCardsV2 = () => {
  const [activeProduct, setActiveProduct] = useState<Products>('Up/Down');

  const metrics = useProfileGraphQl2(activeProduct);
  console.log(metrics, 'metrics');
  const { data }: { data?: IReferralStat } = useUserReferralStats();
  return (
    <Section
      Heading={
        <div className="text-f22 flex items-center gap-3">
          Metrics{' '}
          <ProductDropDown
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
          />
        </div>
      }
      subHeading={<></>}
      Cards={[
        <Referral data={data} heading={'Referral Metrics'} />,
        <TradingCardV2
          data={metrics?.['USDC.e']}
          heading={'USDC Trading Metrics'}
          tokenName="USDC.e"
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
