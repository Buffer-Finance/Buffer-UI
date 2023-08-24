import { useMemo } from 'react';
import { BufferLogoComponent } from './BufferLogo';
import { getTabs } from 'src/Config/getTabs';
import { TabsDropdown } from './TabsDropDown';
import { Tab } from './Tab';
import { AccountDropdown } from './AccountDropdown';
import { social } from './socialLinks';
import { useGlobal } from '@Contexts/Global';
import MenuLogo from '@Assets/Elements/MenuLogo';
import CloseLogo from '@SVG/Elements/Closelogo';
import { useAtomValue } from 'jotai';
import { urlSettings } from 'src/Config/wagmiClient';
import { isTestnet } from 'config';
import { SettingsDD } from './SettingsDD';
import { activeMarketFromStorageAtom } from 'src/globalStore';
import MemoWalletSVG from '@SVG/Elements/WalletSVG';
import MemoHamburgerSVG from '@SVG/Elements/HamburgerSVG2';
import { useShutterHandlers } from '../MobileShutter/MobileShutter';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';

interface INavbar {}

export const Navbar: React.FC<INavbar> = () => {
  const { state, dispatch } = useGlobal();
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getTabs(activeMarketFromStorage),
    [activeMarketFromStorage]
  );
  const VISIBLETABS = isTestnet ? 6 : 4;
  // const MORETABS = isTestnet ? 2 : 3;
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  const { openOngoingTradesShutter, shutterState } = useShutterHandlers();
  const [activeTrades, limitOrderTrades] = useOngoingTrades();

  const show = !urlSettings?.hide;
  return (
    <header className="  sticky bg-[#232334] top-[0px] flex justify-between w-full h-[45px] pr-[8px] header top-0 z-[102]">
      <div className="flex items-center ">
        <div
          role={'button'}
          onClick={() => window.open('https://buffer.finance/', '_blank')}
          // className="sm:hidden"
        >
          <BufferLogoComponent
            className="h-[30px] ml-[8px] sm:mx-[0px]"
            hideText
          />
        </div>
        <div className="a1200:hidden flex gap-x-4 items-center pl-4">
          <MemoHamburgerSVG onClick={handleClose} />
          <MemoWalletSVG
            count={activeTrades.length + limitOrderTrades.length}
            className={
              shutterState.open == 'ActiveOrders' ? 'text-1' : 'text-[#808191]'
            }
            onClick={openOngoingTradesShutter}
          />
        </div>

        {show && (
          <div className="b1200:hidden flex gap-[6px]  ">
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
            {/* {tabs.length > VISIBLETABS && (
              <TabsDropdown
                tabs={tabs.slice(VISIBLETABS, -MORETABS)}
                defaultName="Analytics"
              />
            )} */}
            {tabs.length > VISIBLETABS && (
              <TabsDropdown tabs={tabs.slice(VISIBLETABS)} defaultName="More" />
            )}
            {/* <TabsDropdown tabs={social} defaultName="Socials" /> */}
          </div>
        )}
      </div>

      <div className="flex items-center gap-[3px] whitespace-nowrap">
        <div id="dropdown-box" className="flex gap-4 items-center text-1">
          <AccountDropdown />
        </div>

        <SettingsDD />

        {/* <div id="mobile-sidebar-logo" className="a1400:!hidden sm:hidden">
          {state.sidebar_active ? (
            <MenuLogo className="icon menu" onClick={handleClose} />
          ) : (
            <CloseLogo
              className="icon menu"
              onClick={handleClose}
              style={{ transform: 'scale(0.8)' }}
            />
          )}
        </div> */}
      </div>
    </header>
  );
};
