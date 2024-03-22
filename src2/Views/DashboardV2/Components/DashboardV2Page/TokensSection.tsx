import { Section } from '@Views/Earn/Components/Section';
import { descStyles, topStyles } from '.';
import BFRcard from '../Cards/BFRcard';
import { BLPcard } from '../Cards/BLPcard';
import { useUBLPdata } from '@Views/DashboardV2/hooks/useReadcalls/useUBLPdata';
import { useABLPdata } from '@Views/DashboardV2/hooks/useReadcalls/useABLPdata';
import { ChainNotSupported } from '@Views/Common/ChainNotSupported';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';

const TokensSection = () => {
  return (
    <Section
      Heading={<div className={topStyles}>Tokens</div>}
      subHeading={
        <div className={descStyles}>Platform and BLP index tokens</div>
      }
      Cards={[
        <BFRcard />,
        <UBLPcard />,
        <ChainNotSupported
          supportedChainIds={[arbitrum.id, arbitrumGoerli.id]}
          children={<ABLPcard />}
          hide
        />,
      ]}
    />
  );
};

export default TokensSection;

const UBLPcard = () => {
  const ublpData = useUBLPdata();
  return <BLPcard data={ublpData} tokenName={'USDC'} poolName={'uBLP'} />;
};

const ABLPcard = () => {
  const ablpData = useABLPdata();
  return <BLPcard data={ablpData} tokenName={'ARB'} poolName={'aBLP'} />;
};
