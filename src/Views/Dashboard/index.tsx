import Drawer from '@Views/Common/V2-Drawer';
import { Section } from '@Views/Earn/Components/Section';
import { OtherBLP, StatsTotalStats, TokensBFR, TokensBLP } from './Cards';
import { Markets } from './Components/Markets';
import { DashboardContextProvider } from './dashboardAtom';
import { useDashboardReadCalls } from './Hooks/useDashBoardReadCalls';
import styled from '@emotion/styled';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useEffect } from 'react';
import { ArbitrumOnly, ExceptArbitrum } from '@Views/Common/ChainNotSupported';
import { useDashboardGraphQl } from './Hooks/useDashboardGraphQl';
import { useOtherChainCalls } from './Hooks/useOtherChainCalls';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import { getChains } from 'src/Config/wagmiClient';
import { chainImageMappipng } from '@Views/Common/Navbar/chainDropdown';
import { useNavigate } from 'react-router-dom';

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
  return (
    <DashboardStyles>
      <Boxes />
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

function Boxes() {
  const { overView } = useDashboardGraphQl();
  const { activeChain } = useActiveChain();
  return (
    <>
      <Section
        Heading={
          <div className="flex items-center">
            <div className={topStyles}>Dashboard</div>
            <ChainSwitchDropdown />{' '}
          </div>
        }
        subHeading={
          <div className={descStyles}>
            {[arbitrum.id, arbitrumGoerli.id].includes(activeChain.id)
              ? 'Arbitrum Total Stats (since 30th Jan, 2023)'
              : 'Polygon Total Stats (since 22nd Feb, 2023)'}
          </div>
        }
        Cards={[
          <StatsTotalStats data={overView} />,
          <ExceptArbitrum hide>
            <DashboardOtherChainData />
          </ExceptArbitrum>,
        ]}
      />
      <ArbitrumOnly hide>
        <DashboardData />
      </ArbitrumOnly>
    </>
  );
}

const DashboardData = () => {
  const { BFR, BLP } = useDashboardReadCalls();
  return (
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
  );
};

const DashboardOtherChainData = () => {
  const { otherBLP } = useOtherChainCalls();
  return <OtherBLP data={otherBLP} tokenName={'BLP'} />;
};

const ChainSwitchDropdown = () => {
  const { activeChain } = useActiveChain();
  const tabList = getChains();
  const navigate = useNavigate();
  return (
    <BufferDropdown
      rootClass="w-fit"
      className="py-4 px-4 bg-2 !w-max"
      dropdownBox={(a, open, disabled) => (
        <div className="flex items-center justify-between text-f15 font-medium bg-[#2c2c41] pl-3 pr-[0] py-[6px] rounded-sm text-1">
          <div className="flex items-center">
            <img
              src={chainImageMappipng[activeChain.name]}
              className="h-[22px] w-[22px] mr-[6px] sm:mr-[0px] rounded-full"
            />
            {activeChain.name}
          </div>
          <DropdownArrow open={open} />
        </div>
      )}
      items={tabList}
      item={(tab, handleClose, onChange, isActive, index) => {
        return (
          <div
            className={`text-f14 whitespace-nowrap ${
              index === tabList.length - 1 ? '' : 'pb-[6px]'
            } ${index === 0 ? '' : 'pt-[6px]'} ${
              activeChain.name === tab.name ? 'text-1' : 'text-2'
            }`}
            onClick={() => navigate(`/dashboard/${tab.name}`)}
          >
            <div className="flex">
              <img
                src={chainImageMappipng[tab.name]}
                className="h-[22px] w-[22px] mr-[6px] sm:mr-[0px] rounded-full"
              />
              {tab.name}
            </div>
          </div>
        );
      }}
    />
  );
};
