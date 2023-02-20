import { Button } from '@mui/material';
import React from 'react';
import { LeaderBoardSidebarStyles } from './style';
import Daily from '@Public/LeaderBoard/Daily';
import SmPnl from 'src/SVG/Elements/PNLL';
import { CHAIN_CONFIGS, getTabs, isTestnet } from 'config';
import { Link, Location, useLocation, useNavigate } from 'react-router-dom';
import { useActiveChain } from '@Hooks/useActiveChain';
import BufferTab from '@Views/Common/BufferTab';

export const MobileLeaderboardDropdwon = () => {
  const { activeChain } = useActiveChain();
  const tabs = getTabs(activeChain.name, true);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.findIndex((tab) =>
    doesLocationMatch(location, tab.slug)
  );
  return (
    <div className="web:hidden my-4">
      <BufferTab
        value={activeTab}
        handleChange={(e, t) => {
          navigate(tabs[t].as);
        }}
        distance={5}
        tablist={[{ name: 'Daily' }, { name: 'Weekly' }]}
      />
    </div>
  );
};

function LeaderBoardMobileNavbar({ tabs }) {
  const location = useLocation();

  return (
    <div className="mobile-navbar-leaderboard">
      {tabs.map((tab) => {
        const isActive = doesLocationMatch(location, tab.slug);

        return (
          <Link key={tab.name} to={tab.as}>
            <div className={`league-btn-wrapper ${isActive && 'active'}`}>
              <SidebarIcon
                id={tab.id}
                active={isActive}
                name={tab.slug.split('/')[0]}
              />{' '}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
export const LeaderBoardSidebar = () => {
  const { activeChain } = useActiveChain();
  const tabs = getTabs(activeChain.name, true);
  const location = useLocation();
  return (
    <LeaderBoardSidebarStyles className="border-r-2 border-1">
      <div className="mt-[10px] full-width">
        <Head name={isTestnet ? 'INCENTIVISD TESTNET' : 'LEADERBOARD'} />

        {tabs.slice(0, 2).map((tab, index) => {
          const isActive = doesLocationMatch(location, tab.slug);
          return (
            <div className="">
              <LinkButton
                tab={tab}
                active={isActive}
                chip={
                  index === 1 ? (
                    <CSChip
                      text="Ongoing"
                      className="text-[#00C4FF] bg-[#00c4ff26] border-[#00C4FF]  box-border"
                    />
                  ) : (
                    <CSChip text="Ended" className="text-3 bg-2 " />
                  )
                }
              />
            </div>
          );
        })}
      </div>

      <div className="mt-[10px] full-width">
        <div className="flex items-center mb-2">
          <Head name="LEAGUES" />
          <CSChip />
        </div>
        {tabs.slice(2, -1).map((tab) => {
          const isActive = doesLocationMatch(location, tab.slug);
          return (
            <div className="flex-col">
              <LinkButton tab={tab} active={isActive} isDisabled />
            </div>
          );
        })}
      </div>

      <div className="mt-[10px] full-width">
        <div className="flex items-center mb-2">
          <Head name="METRICS" />
          <CSChip />
        </div>
        {tabs.slice(-1).map((tab) => {
          const isActive = doesLocationMatch(location, tab.slug);
          return (
            <div className="flex-col">
              <LinkButton tab={tab} active={isActive} isDisabled />
            </div>
          );
        })}
      </div>
    </LeaderBoardSidebarStyles>
  );
};

function Head({ name }: { name: string }) {
  return <div className="text-f12 fw5 pl-4 pr-3">{name}</div>;
}

const LinkButton = ({ tab, active, isDisabled = false, chip = <></> }) => {
  return (
    <div
      className={`flex relative items-center ${active && 'activeLink'} pr-3`}
    >
      <Link
        key={tab.name}
        to={tab.as}
        className={`${isDisabled ? 'pointer-events-none ' : ''}`}
      >
        <Button key={tab.id} className={`flex-center item `} onClick={() => {}}>
          <SidebarIcon
            id={tab.id}
            active={active}
            name={tab.slug.split('/')[0]}
          />
          <div className={`ml-3 ${active && 'text-1 font-semibold'}`}>
            {tab.name}
          </div>
        </Button>
      </Link>
      {chip}
    </div>
  );
};
interface IProp {
  id: number;
  active: boolean;
  name: string;
}
const SidebarIcon: React.FC<IProp> = ({ id, ...props }) => {
  if (props.name == 'ARBITRUM')
    return (
      <img src={CHAIN_CONFIGS['TESTNET'].ARBITRUM.img} alt="" className="w-5" />
    );

  switch (id) {
    case 0:
      return (
        <img
          src={CHAIN_CONFIGS['TESTNET'].ARBITRUM.img}
          alt=""
          className="w-5"
        />
      );
    case 0:
      return (
        <img
          src={CHAIN_CONFIGS['TESTNET'].ARBITRUM.img}
          alt=""
          className="w-5"
        />
      );
    case 1:
      return <Daily {...props} width={20} height={20} />;
    case 2:
      return (
        <img src="/LeaderBoard/Diamond.png" alt="Icon" className="w2 h2" />
      );
    case 3:
      return (
        <img src="/LeaderBoard/Platinum.png" alt="Icon" className="w2 h2" />
      );
    case 4:
      return <img src="/LeaderBoard/Gold.png" alt="Icon" className="w2 h2" />;
    case 5:
      return <img src="/LeaderBoard/Silver.png" alt="Icon" className="w2 h2" />;
    case 6:
      return <img src="/LeaderBoard/Bronze.png" alt="Icon" className="w2 h2" />;

    default:
      return <SmPnl {...props} width={20} height={20} />;
  }
};

export function doesLocationMatch(location: Location, slug: string) {
  // if (!location) return false;
  return location.pathname.includes(slug);
}

const CSChip = ({
  className = 'text-1 bg-2',
  text = 'Coming Soon',
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div
      className={`py-2 px-3 text-f12 font-medium mr-2 rounded-md ${className}`}
    >
      {text}
    </div>
  );
};
