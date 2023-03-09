import Drawer from '@Views/Common/V2-Drawer';
import { Section } from '@Views/Earn/Components/Section';
import { StatsOverView, StatsTotalStats, TokensBFR, TokensBLP } from './Cards';
import { Markets } from './Components/Markets';
import { DashboardContextProvider } from './dashboardAtom';
import { useDashboardReadCalls } from './Hooks/useDashBoardReadCalls';
import styled from '@emotion/styled';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useEffect } from 'react';

const DashboardStyles = styled.div`
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

const topStyles = 'mx-3 text-f22';
const descStyles = 'mx-3';

export const Dashboard = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = 'Buffer | Dashboard';
  }, []);
  return (
    <DashboardContextProvider value={{ activeChain }}>
      <main className="content-drawer">
        {/* <HeadTitle title={"Buffer | Dashboard"} /> */}
        <DashboardPage />
      </main>
      <Drawer open={false}>
        <></>
      </Drawer>
    </DashboardContextProvider>
  );
};

const DashboardPage = () => {
  const { BFR, BLP, overView, total } = useDashboardReadCalls();
  return (
    <DashboardStyles>
      <Section
        Heading={<div className={topStyles}>Dashboard</div>}
        subHeading={
          <div className={descStyles}>
            Arbitrum Total Stats (since 30th Jan, 2023)
          </div>
        }
        Cards={[
          // <StatsOverView data={overView} />,
          <StatsTotalStats data={total} />,
        ]}
      />{' '}
      <Section
        Heading={<div className={topStyles}>Tokens</div>}
        subHeading={
          <div className={descStyles}>Platform and BLP index tokens</div>
        }
        Cards={[
          <TokensBFR data={BFR} tokenName={'BFR'} />,
          <TokensBLP data={BLP} tokenName={'BLP'} />,
        ]}
      />
      <Section
        Heading={<div className={topStyles}>Markets</div>}
        subHeading={
          <div className={descStyles}>
            Discover new Pairs available on Buffer
            {/* (Stats since 30th Jan, 2023) */}
          </div>
        }
        other={<Markets />}
      />
    </DashboardStyles>
  );
};
