import { useMemo } from 'react';
import { BufferLogoComponent } from './BufferLogo';
import { BlueBtn } from '../V2-Button';
import { getTabs } from 'src/Config/getTabs';
import { TabsDropdown } from './TabsDropDown';
import { Tab } from './Tab';
import { AccountDropdown } from './AccountDropdown';
import { social } from './socialLinks';
import { useGlobal } from '@Contexts/Global';
import MenuLogo from '@Assets/Elements/MenuLogo';
import CloseLogo from '@SVG/Elements/Closelogo';
import NFTtier from '../NFTtier';
import LeaderboardTropy from '@Public/LeaderBoard/Trophy';
import { Link } from 'react-router-dom';

interface INavbar {}

export const Navbar: React.FC<INavbar> = () => {
  const { state, dispatch } = useGlobal();
  const tabs = useMemo(() => getTabs(), []);
  const VISIBLETABS = 8;
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  return (
    <header className="bg-primary flex justify-between w-full h-[45px] pr-[8px] header top-0 border-b-2 border-solid border-1 z-[1500]">
      <div className=" flex items-center gap-[24px]">
        <div
          role={'button'}
          onClick={() => window.open('https://buffer.finance/', '_blank')}
        >
          <BufferLogoComponent className="h-[30px] ml-[8px] sm:ml-[10px]" />
        </div>

        <div className="tab:hidden flex gap-[6px] b1200:!hidden ">
          {tabs.slice(0, VISIBLETABS).map((tab, index) => {
            if (tab.isExternalLink) {
              return (
                <button
                  key={tab.name}
                  className={`font-normal text-4 text-f15  px-4 py-[4px] rounded-md hover:text-1 transition-colors 
                 
                      : "hover:bg-1 hover:brightness-125"
                  `}
                  onClick={() => {
                    window.open(tab.to, '_blank');
                  }}
                >
                  {tab.name}
                </button>
              );
            }
            return <Tab tab={tab} key={tab.name} />;
          })}

          {tabs.length > VISIBLETABS && (
            <TabsDropdown tabs={tabs.slice(VISIBLETABS)} defaultName="More" />
          )}
          <TabsDropdown tabs={social} defaultName="Socials" />
        </div>
      </div>

      <div className="flex items-center gap-[7px] whitespace-nowrap">
        <NFTtier />

        {/* {import.meta.env.VITE_ENV === 'TESTNET' && (
          <BlueBtn
            onClick={() => {
              window.open('https://app.buffer.finance', '_blank');
            }}
            className="!h-[30px] rounded-[6px] !text-f13 font-medium hover:brightness-125 hover:!translate-y-[0px] px-5 sm:hidden"
          >
            Mainnet
          </BlueBtn>
        )} */}

        <BlueBtn
          onClick={() => {}}
          className="!h-[30px] rounded-[6px] w-fit !text-f13 font-medium hover:brightness-125 hover:!translate-y-[0px] pl-4 pr-5 sm:pl-1 sm:pr-1"
        >
          <Link
            to="/leaderboard/incentivised"
            className="flex items-center gap-1"
          >
            <LeaderboardTropy height={23} />
            <span className="sm:hidden">Contest</span>
          </Link>
        </BlueBtn>
        <div id="dropdown-box" className="flex gap-4 items-center text-1">
          {/* <ChainDropdown /> */}
          <AccountDropdown />
        </div>

        <div id="mobile-sidebar-logo" className="web:!hidden ">
          {state.sidebar_active ? (
            <MenuLogo className="icon menu" onClick={handleClose} />
          ) : (
            <CloseLogo
              className="icon menu"
              onClick={handleClose}
              style={{ transform: 'scale(0.8)' }}
            />
          )}
        </div>
      </div>
    </header>
  );
};
