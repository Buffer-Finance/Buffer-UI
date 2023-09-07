import styled from '@emotion/styled';
import { OverViewSection } from './OverviewSection';
import TokensSection from './TokensSection';
import MarketsSection from './MarketsSection';
import { ChainNotSupported } from '@Views/Common/ChainNotSupported';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';

const DashboardV2Page = () => {
  return (
    <DashboardV2Styles>
      <OverViewSection />
      <ChainNotSupported
        hide
        supportedChainIds={[arbitrum.id, arbitrumGoerli.id]}
      >
        <TokensSection />
      </ChainNotSupported>
      <ChainNotSupported
        hide
        supportedChainIds={[arbitrumGoerli.id, arbitrum.id]}
      >
        <MarketsSection />
      </ChainNotSupported>
    </DashboardV2Styles>
  );
};

export default DashboardV2Page;
export const topStyles = 'mx-3 text-f22';
export const descStyles = 'mx-3';
const DashboardV2Styles = styled.div`
  width: min(1300px, 100%);
  margin: auto;
  height: 100%;
  padding-bottom: 24px;

  .stats-label {
    font-size: 1.4rem;
    line-height: 1.6rem;
    border-radius: 0.4rem;
    padding: 1.05rem;
    letter-spacing: 0.4px;
    text-align: left;
    z-index: 1;
    background: linear-gradient(90deg, #0b0b0f 0%, rgba(10, 13, 28, 1) 100%);
    cursor: pointer;
  }

  .stats-label-color {
    width: 0.4rem;
    height: 100%;
    margin-right: 1.5rem;
  }
`;
