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
import { useAtomValue } from 'jotai';
import { activeMarketFromStorageAtom } from '@Views/BinaryOptions';
import { useAccount } from 'wagmi';
import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { urlSettings } from 'src/Config/wagmiClient';
import { isTestnet } from 'config';
import { ClaimLBFRBtn } from '@Views/Profile/LBFR';
import { useUserAccount } from '@Hooks/useUserAccount';
import { ArbitrumOnly } from '../ChainNotSupported';

interface INavbar {}

export const Navbar: React.FC<INavbar> = () => {
  const { state, dispatch } = useGlobal();
  const { address } = useAccount();
  const { address: account, viewOnlyMode } = useUserAccount();
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getTabs(activeMarketFromStorage),
    [activeMarketFromStorage]
  );
  const VISIBLETABS = isTestnet ? 5 : 4;
  const MORETABS = isTestnet ? 2 : 3;
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  const show = !urlSettings?.hide;
  return (
    <header className="flex justify-between w-full h-[45px] pr-[8px] header top-0 border-b-2 border-solid border-1 relative z-[102]">
      <div className="flex items-center gap-[24px]">
        <div
          role={'button'}
          onClick={() => window.open('https://buffer.finance/', '_blank')}
        >
          <BufferLogoComponent
            className="h-[30px] ml-[8px] sm:mx-[2px]"
            hideText
          />
        </div>

        {show && (
          <div className="tab:hidden flex gap-[6px] b1400:!hidden ">
            {tabs.slice(0, VISIBLETABS).map((tab, index) => {
              if (tab.isExternalLink) {
                return (
                  <button
                    key={tab.name}
                    className={`font-normal text-4 text-f15  px-4 py-[4px] rounded-md hover:bg-1 hover:text-1 hover:brightness-125 transition-colors 
                 
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
              <TabsDropdown
                tabs={tabs.slice(VISIBLETABS, -MORETABS)}
                defaultName="Analytics"
              />
            )}
            {tabs.length > VISIBLETABS && (
              <TabsDropdown tabs={tabs.slice(-MORETABS)} defaultName="More" />
            )}
            <TabsDropdown tabs={social} defaultName="Socials" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-[3px] whitespace-nowrap">
        {address && (
          <div className="text-f13 bg-[#2C2C41] h-[30px] px-3 sm:px-2 special-hover hover:brightness-125 rounded-[7px] items-center flex !w-fit">
            <NFTtier userOnly />
          </div>
        )}

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

        {!viewOnlyMode && (
          <ArbitrumOnly hide>
            <ClaimLBFRBtn
              shouldShowValue
              shouldShowIcon
              shouldNotShowForZero
              className="!h-[30px] !bg-[#232334] hover:!bg-blue !rounded-[7px] !w-fit !text-f13 font-medium hover:brightness-125 hover:!translate-y-[0px] px-4 sm:px-3"
            />
          </ArbitrumOnly>
        )}
        {/* <BlueBtn
          onClick={() => {}}
          className="!h-[30px] rounded-[6px] !w-fit !text-f13 font-medium hover:brightness-125 hover:!translate-y-[0px] pl-4 pr-5 sm:pl-1 sm:pr-1"
        >
          <Link to="/leaderboard/weekly" className="flex items-center gap-1">
            <LeaderboardTropy height={23} />
            <span className="sm:hidden">Contest</span>
          </Link>
        </BlueBtn> */}

        <div id="dropdown-box" className="flex gap-4 items-center text-1">
          {/* <ChainDropdown /> */}
          <AccountDropdown />
        </div>
        <div id="mobile-sidebar-logo" className="a1400:!hidden sm:hidden">
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
