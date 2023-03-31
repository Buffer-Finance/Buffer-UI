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
import { useLocation, useNavigate } from 'react-router-dom';
import { TokenDataNotIncludedWarning } from '@Views/Common/TokenDataNotIncludedWarning';

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
      <TokenDataNotIncludedWarning />
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
            <ChainSwitchDropdown baseUrl="/dashboard" />{' '}
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
  const { BFR, BLP, aBLP } = useDashboardReadCalls();
  return (
    <Section
      Heading={<div className={topStyles}>Tokens</div>}
      subHeading={
        <div className={descStyles}>Platform and BLP index tokens</div>
      }
      Cards={[
        <TokensBFR data={BFR} tokenName={'BFR'} />,
        <TokensBLP data={BLP} tokenName={'USDC'} poolName={'uBLP'} />,
        <TokensBLP data={aBLP} tokenName={'ARB'} poolName={'aBLP'} />,
      ]}
    />
  );
};

const DashboardOtherChainData = () => {
  const { otherBLP } = useOtherChainCalls();
  return <OtherBLP data={otherBLP} tokenName={'BLP'} />;
};

export const ChainSwitchDropdown = ({
  baseUrl,
  classes = {
    imgDimentions: 'h-[22px] w-[22px] ',
    fontSize: 'text-f15',
    itemFontSize: 'text-f14',
    verticalPadding: 'py-[6px]',
  },
}: {
  baseUrl: string;
  classes?: {
    imgDimentions: string;
    fontSize: string;
    itemFontSize: string;
    verticalPadding: string;
  };
}) => {
  const { activeChain } = useActiveChain();
  const tabList = getChains();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BufferDropdown
      rootClass="w-fit m-auto"
      className="py-4 px-4 bg-2 !w-max"
      dropdownBox={(a, open, disabled) => (
        <div
          className={`flex items-center justify-between ${classes.fontSize} font-medium bg-[#2c2c41] pl-3 pr-[0] ${classes.verticalPadding} rounded-sm text-1`}
        >
          <div className="flex items-center">
            <img
              src={chainImageMappipng[activeChain.name]}
              className={`${classes.imgDimentions} mr-[6px] rounded-full`}
            />
            {activeChain.name}
          </div>
          <DropdownArrow open={open} />
        </div>
      )}
      items={tabList}
      item={(tab, handleClose, onChange, isActive, index) => {
        let navigationUrl = `${baseUrl}/${tab.name}`;
        if (location.search !== '') {
          navigationUrl = navigationUrl + location.search;
        }
        return (
          <div
            className={`${classes.itemFontSize} whitespace-nowrap ${
              index === tabList.length - 1 ? '' : 'pb-[6px]'
            } ${index === 0 ? '' : 'pt-[6px]'} ${
              activeChain.name === tab.name ? 'text-1' : 'text-2'
            }`}
            onClick={() => navigate(navigationUrl)}
          >
            <div className="flex">
              <img
                src={chainImageMappipng[tab.name]}
                className={`${classes.imgDimentions} mr-[6px] rounded-full`}
              />
              {tab.name}
            </div>
          </div>
        );
      }}
    />
  );
};
