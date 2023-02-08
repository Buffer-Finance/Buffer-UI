import { Button } from '@mui/material';
import React, { useState } from 'react';
import { LeaderBoardSidebarStyles } from './style';
import Daily from '@Public/LeaderBoard/Daily';
import SmPnl from 'src/SVG/Elements/PNLL';
import { CHAIN_CONFIGS, getTabs, isTestnet } from 'config';
import { useGlobal } from '@Contexts/Global';
import BufferDropdown from '@Views/Common/BufferDropdown';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { Link, Location, useLocation } from 'react-router-dom';
import { useActiveChain } from '@Hooks/useActiveChain';

export const DropdownArrow: React.FC<{ open: boolean; className?: string }> = ({
  open,
  className = '',
}) => {
  return (
    <ArrowDropDownRounded
      className={`transition-all duration-200 ease-out dropdown-arrow ${
        open ? 'origin rotate-180' : ''
      } ${className}`}
    />
  );
};

// export const MobileLeaderboardDropdwon = () => {
//   const { state } = useGlobal();
//   let chain = '';
//   let asset = '';
//   let ref = '';
//   if (state.settings.activeChain) {
//     chain = state.settings.activeChain.name + '/';
//   }
//   if (state.settings.activeAsset) {
//     asset = '/' + state.settings.activeAsset.name;
//   } else {
//     if (state.settings.activeChain) {
//       asset = '/' + state.settings.activeChain.nativeAsset.name;
//     }
//   }
//   if (router.query?.ref) {
//     ref = '?ref=' + router.query.ref;
//   }
//   if (chain === '') chain = 'BSC/';
//   if (asset === '') asset = '/BNB';
//   asset += ref;
//   const tabs = [
//     {
//       pathname: '/[chain]/leaderboard/[offset]/incentivised',
//       name: 'Incentivised Testnet',
//       slug: 'incentivised',
//       id: 0,

//       subTabs: [
//         // {
//         //   pathname: "/[chain]/leaderboard/[offset]/incentivised",
//         //   as: `/POLYGON/leaderboard/0/incentivised`,
//         //   name: "Polygon Testnet",
//         //   slug: "POLYGON",
//         //   id: 0,
//         //   subtabs: [],
//         //   img: "https://cdn.buffer.finance/Buffer-Website-Data/main/chains/polygon2.png",
//         // },
//         {
//           pathname: '/[chain]/leaderboard/[offset]/incentivised',
//           name: 'Arbitrum Testnet',
//           slug: 'ARBITRUM',
//           id: 0,
//           subTabs: [],
//           img: '/Chains/ARBITRIUM.png',
//         },
//       ],
//     },
//     {
//       pathname: '/[chain]/leaderboard/[offset]/daily',
//       as: `/${chain}leaderboard/0/daily`,
//       name: 'Competition',
//       slug: 'daily',
//       id: 1,

//       subTabs: [],
//     },
//     {
//       pathname: '/[chain]/leaderboard/[offset]/weekly/[league]',
//       as: `/${chain}leaderboard/0/weekly/diamond`,
//       name: 'Leagues',
//       slug: 'diamond',
//       id: 2,
//       img: '/LeaderBoard/Diamond.png',
//       subTabs: [
//         {
//           pathname: '/[chain]/leaderboard/[offset]/weekly/[league]',
//           as: `/${chain}leaderboard/0/weekly/diamond`,
//           name: 'diamond',
//           slug: 'diamond',
//           id: 2,
//           img: '/LeaderBoard/Diamond.png',
//           subTabs: [],
//         },
//         {
//           pathname: '/[chain]/leaderboard/[offset]/weekly/[league]',
//           as: `/${chain}leaderboard/0/weekly/platinum`,
//           name: 'platinum',
//           slug: 'platinum',
//           id: 3,
//           img: '/LeaderBoard/Platinum.png',
//           subTabs: [],
//         },
//         {
//           pathname: '/[chain]/leaderboard/[offset]/weekly/[league]',
//           as: `/${chain}leaderboard/0/weekly/gold`,
//           name: 'gold',
//           slug: 'gold',
//           id: 4,
//           img: '/LeaderBoard/Gold.png',
//           subTabs: [],
//         },
//         {
//           pathname: '/[chain]/leaderboard/[offset]/weekly/[league]',
//           as: `/${chain}leaderboard/0/weekly/silver`,
//           name: 'silver',
//           slug: 'silver',
//           id: 5,
//           img: '/LeaderBoard/Silver.png',
//           subTabs: [],
//         },
//         {
//           pathname: '/[chain]/leaderboard/[offset]/weekly/[league]',
//           as: `/${chain}leaderboard/0/weekly/bronze`,
//           name: 'bronze',
//           slug: 'bronze',
//           id: 6,
//           img: '/LeaderBoard/Bronze.png',
//           subTabs: [],
//         },
//       ],
//     },
//     {
//       as: `/${chain}leaderboard/0/pnl`,
//       name: 'Metrics',
//       slug: 'pnl',
//       id: 7,
//       subTabs: [],
//     },
//   ];
//   const activeTab = tabs.find((tab) => router.asPath.includes(tab.slug));
//   return (
//     <div className="web:hidden">
//       <div className="w-fit mt-2">
//         <BufferDropdown
//           className="bg-primary text-f13 text-4 py-[12px] px-3 "
//           rootClass="bg-1 px-4 py-2 text-f14 font-bold text-3 min-w-[180px]"
//           dropdownBox={(item, isOpen) => (
//             <div className="flex justify-between capitalize">
//               {activeTab?.name || 'Leaderboard'}
//               <DropdownArrow open={isOpen} />
//             </div>
//           )}
//           initialActive={1}
//           items={tabs}
//           item={(tab, handleClose, onChange, activel) => (
//             <Link
//               href={tab.pathname}
//               as={tab.as}
//               key={tab.name}
//               className=""
//               onClick={() => {}}
//             >
//               <a
//                 className={`hover:text-1 py-2 text-left ${
//                   activeTab?.name === tab.name ? 'text-1' : ''
//                 }`}
//               >
//                 {tab.name}
//               </a>
//             </Link>
//           )}
//         />
//       </div>
//       {activeTab.subTabs.length > 0 && (
//         <LeaderBoardMobileNavbar tabs={activeTab.subTabs} />
//       )}
//     </div>
//   );
// };

function LeaderBoardMobileNavbar({ tabs }) {
  return (
    <div className="mobile-navbar-leaderboard">
      {tabs.map((tab) => {
        // const isActive = router.asPath.includes(tab.slug);
        const isActive = false;
        return (
          <Link key={tab.name} href={tab.pathname} as={tab.as}>
            <div className={`league-btn-wrapper ${isActive && 'active'}`}>
              <img className={`mobile-league-btn`} src={tab.img}></img>
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

        {tabs.slice(0, 1).map((tab) => {
          const isActive = doesLocationMatch(location, tab.slug);
          return (
            <div className="flex-col">
              <LinkButton tab={tab} active={isActive} />
            </div>
          );
        })}
      </div>

      {/* <div className="mt-[10px] full-width">
        <div className="flex items-center mb-2">
          <Head name="COMPETITION" />
          <CSChip />
        </div>
        {tabs.slice(1, 3).map((tab) => {
          const isActive = router.asPath.includes(tab.slug);
          return (
            <div className="flex-col">
              <LinkButton tab={tab} active={isActive} isDisabled />
            </div>
          );
        })}
      </div> */}

      <div className="mt-[10px] full-width">
        <div className="flex items-center mb-2">
          <Head name="LEAGUES" />
          <CSChip />
        </div>
        {tabs.slice(1, -1).map((tab) => {
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

const LinkButton = ({ tab, active, isDisabled = false }) => {
  return (
    <Link key={tab.name} href={tab.pathname} as={tab.as} className="">
      <a className={`${isDisabled ? 'pointer-events-none ' : ''}`}>
        <Button
          key={tab.id}
          className={`flex-center item ${active && 'activeLink'}`}
          onClick={() => {}}
        >
          <SidebarIcon
            id={tab.id}
            active={active}
            name={tab.slug.split('/')[0]}
          />
          <div className={` ml-3 `}>{tab.name}</div>
        </Button>
      </a>
    </Link>
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

export const Dropdown = ({ tabs, name }) => {
  const location = useLocation();

  const [open, setOpen] = useState(
    !!tabs.find((tab) => doesLocationMatch(location, tab.slug))
  );

  return (
    <div className="mt-2">
      <button
        onClick={() => {
          setOpen((prv) => !prv);
        }}
        className={`text-f14 text-6 flex justify-between items-center ${
          open ? 'text-1' : 'hover:text-1'
        } mr-3 `}
      >
        <>{name}</>
        <ArrowDropDownRounded
          className={`transition-transform duration-200 ease-out dropdown-arrow ${
            open ? 'origin rotate-180' : ''
          }`}
        />
      </button>

      <div className="transition-all duration-300 pl-5">
        {open &&
          tabs.map((tab, index) => (
            <LinkButton
              tab={tab}
              active={doesLocationMatch(location, tab.slug)}
            />
          ))}
      </div>
    </div>
  );
};

const CSChip = () => {
  return (
    <div className="bg-2 py-2 px-3 rounded-[4px] text-f12 font-medium text-1 mr-2">
      Coming Soon
    </div>
  );
};
