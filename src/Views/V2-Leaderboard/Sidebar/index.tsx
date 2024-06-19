import { useActiveChain } from '@Hooks/useActiveChain';
import Daily from '@Public/LeaderBoard/Daily';
import BufferTab from '@Views/Common/BufferTab';
import {
  CHAIN_CONFIGS,
  getLeaderBoardTabs,
  getMobileLeaderboardTabs,
  isTestnet,
} from 'config';
import React, { useMemo } from 'react';
import { Link, Location, useLocation, useNavigate } from 'react-router-dom';
import SmPnl from 'src/SVG/Elements/PNLL';
import { useDayOfTournament } from '../Hooks/useDayOfTournament';
import { useWeekOfTournament } from '../Hooks/useWeekOfTournament';
import { DailyTournamentConfig } from '../Incentivised/config';
import { weeklyTournamentConfig } from '../Weekly/config';
import { weeklyTournamentConfig as galxeTournamentConfig } from '../Galxe/config';
import { LeaderBoardSidebarStyles } from './style';

export const MobileLeaderboardDropdwon = () => {
  const tabs = getMobileLeaderboardTabs();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.findIndex((tab) =>
    doesLocationMatch(location, tab.slug)
  );
  return (
    <div className="web:hidden my-4">
      <BufferTab
        className="flex justify-center !text-f16"
        value={activeTab}
        handleChange={(e, t) => {
          navigate(tabs[t].as);
        }}
        tablist={[
          // { name: 'Galxe' },
          { name: 'Daily' },
          { name: 'Leagues' },
          // { name: 'Metrics' },
        ]}
      />
      {tabs[activeTab].subTabs.length > 0 && (
        <div className="flex justify-between mt-6 max-w-[300px] mx-auto b1200:mt-7">
          {tabs[activeTab].subTabs.map((tab) => {
            const isSubTabActive = doesLocationMatch(location, tab.slug);
            return (
              <button
                className={`sm:!scale-[200%] b1200:scale-[275%] ${
                  isSubTabActive ? '' : 'opacity-20'
                }`}
                onClick={() => {
                  console.log(`index-tab.as: `, tab.as);
                  navigate(tab.as);
                }}
              >
                <SidebarIcon
                  id={tab.id}
                  active={false}
                  name={tab.slug.split('/')[0]}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
const OnGoingChip = () => {
  return (
    <CSChip
      text="Ongoing"
      className="text-[#2BD67B] bg-[#2bd67b26] border-[#00C4FF]  box-border"
    />
  );
};
const EndedChip = () => {
  return <CSChip text="Ended" className="text-3 bg-2 " />;
};
export const LeaderBoardSidebar = () => {
  const { activeChain } = useActiveChain();
  const tabs = getLeaderBoardTabs();
  const location = useLocation();
  const { day } = useDayOfTournament();
  const weeklyConfigValue = weeklyTournamentConfig[activeChain.id];
  // const galxeConfigValue = galxeTournamentConfig[activeChain.id];

  const { week } = useWeekOfTournament({
    startTimestamp: weeklyConfigValue.startTimestamp,
  });
  const dailyConfigValue = DailyTournamentConfig[activeChain.id];
  const DailyChip = useMemo(() => {
    if (dailyConfigValue.endDay === undefined) return <OnGoingChip />;
    else if (day !== null && day < dailyConfigValue.endDay)
      return <OnGoingChip />;
    else return <EndedChip />;
  }, [day]);
  const WeeklyChip = useMemo(() => {
    if (weeklyConfigValue.endDay === undefined) return <OnGoingChip />;
    else if (week !== null && week < weeklyConfigValue.endDay)
      return <OnGoingChip />;
    else return <EndedChip />;
  }, [week]);
  // const GalxeChip = useMemo(() => {
  //   if (galxeConfigValue.endDay === undefined) return <OnGoingChip />;
  //   else if (week !== null && week < galxeConfigValue.endDay)
  //     return <OnGoingChip />;
  //   else return <EndedChip />;
  // }, [week]);

  return (
    <LeaderBoardSidebarStyles className="border-r-2 border-1">
      <div className="sticky top-1">
        <div className="mt-[16px] full-width">
          <Head name={isTestnet ? 'INCENTIVISD TESTNET' : 'LEADERBOARD'} />

          {tabs.slice(1, 2).map((tab, index) => {
            const isActive = doesLocationMatch(location, tab.slug);
            return (
              <div className="" key={tab.slug}>
                <LinkButton
                  tab={tab}
                  active={isActive}
                  chip={index === 1 ? WeeklyChip : DailyChip}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-[24px] full-width">
          <div className="flex items-center mb-2">
            <Head name="LEAGUES" />
          </div>
          {tabs.slice(2, -1).map((tab) => {
            const isActive = doesLocationMatch(location, tab.slug);
            return (
              <div className="flex-col" key={tab.slug}>
                <LinkButton tab={tab} active={isActive} />
              </div>
            );
          })}
        </div>

        {/* <div className="mt-[24px] full-width">
          <div className="flex items-center mb-2">
            <Head name="METRICS" />
          </div>
          {tabs.slice(-1).map((tab) => {
            const isActive = doesLocationMatch(location, tab.slug);
            return (
              <div className="flex-col" key={tab.slug}>
                <LinkButton tab={tab} active={isActive} />
              </div>
            );
          })}
        </div> */}

        {/* <div className="mt-[24px] full-width relative">
          <NavLink
            key={'ALL TRADES'}
            to={'/leaderboard/trades'}
            className={({ isActive }) => {
              return `flex items-center justify-start px-3 text-f12  ${
                isActive
                  ? 'text-1'
                  : 'hover:bg-1 hover:text-1 hover:brightness-125 text-3'
              } ${isActive && ' activeLink'}
              `;
            }}
          >
            <img src="/alltrades.png" alt="icon" className="inline w-7" />
            ALL TRADES
          </NavLink>
        </div> */}
      </div>
    </LeaderBoardSidebarStyles>
  );
};

function Head({ name }: { name: string }) {
  return <div className="text-f12 fw5 pl-4 pr-3">{name}</div>;
}

const LinkButton = ({
  tab,
  active,
  isDisabled = false,
  chip = <></>,
}: {
  tab: { id: number; name: string; as: string; slug: string };
  active: boolean;
  isDisabled?: boolean;
  chip?: JSX.Element;
}) => {
  return (
    <div className={`relative`} key={tab.id}>
      <Link
        key={tab.name}
        to={tab.as}
        className={`flex items-center justify-start item ${
          isDisabled ? 'pointer-events-none ' : ''
        } ${active && 'activeLink'}`}
      >
        <SidebarIcon
          id={tab.id}
          active={active}
          name={tab.slug.split('/')[0]}
        />

        <div className={`ml-3 ${active && 'text-1 font-semibold'} w-fit`}>
          {tab.name}
        </div>

        <div className="pr-3 ml-3">{chip}</div>
      </Link>
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
      return <Daily {...props} width={20} height={20} color={'#8B67C7'} />;
    case 2:
      return (
        <img
          src="/LeaderBoard/Diamond.png"
          alt="Icon"
          className="w-[2.7rem] h2"
        />
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
    case 7:
      return <Daily {...props} width={20} height={20} color={'#6966FF'} />;
    case 8:
      return (
        <img
          src="https://res.cloudinary.com/dtuuhbeqt/image/upload/Leaderboard/bbb.png"
          height={16}
          width={16}
          className="mx-1"
        />
      );

    default:
      return <SmPnl {...props} width={20} height={20} />;
  }
};

export function doesLocationMatch(location: Location, slug: string) {
  // if (!location) return false;
  return location.pathname.includes(slug);
}

const CSChip = ({
  className = 'bg-2',
  text = 'Coming Soon',
}: {
  className?: string;
  text?: string;
}) => {
  return (
    <div
      className={`py-2 px-3 text-f12 text-3 font-medium mr-2 rounded-md ${className}`}
    >
      {text}
    </div>
  );
};

// function LeaderBoardMobileNavbar({ tabs }) {
//   const location = useLocation();

//   return (
//     <div className="mobile-navbar-leaderboard">
//       {tabs.map((tab) => {
//         const isActive = doesLocationMatch(location, tab.slug);

//         return (
//           <Link key={tab.name} to={tab.as}>
//             <div className={`league-btn-wrapper ${isActive && 'active'}`}>
//               <SidebarIcon
//                 id={tab.id}
//                 active={isActive}
//                 name={tab.slug.split('/')[0]}
//               />{' '}
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }
