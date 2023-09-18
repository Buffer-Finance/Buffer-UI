import { useMemo, useState } from 'react';
import { BufferLogoComponent } from './BufferLogo';
import { getTabs } from 'src/Config/getTabs';
import { TabsDropdown } from './TabsDropDown';
import { Tab } from './Tab';
import { AccountDropdown } from './AccountDropdown';
import { useGlobal } from '@Contexts/Global';
import { useAtomValue } from 'jotai';
import { urlSettings } from 'src/Config/wagmiClient';
import { isTestnet } from 'config';
import { SettingsDD } from './SettingsDD';
import { activeMarketFromStorageAtom } from 'src/globalStore';
import MemoWalletSVG from '@SVG/Elements/WalletSVG';
import MemoHamburgerSVG from '@SVG/Elements/HamburgerSVG2';
import { useShutterHandlers } from '../MobileShutter/MobileShutter';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { useNavigate } from 'react-router-dom';
import { inIframe } from '@Utils/isInIframe';

interface INavbar {}

export const Navbar: React.FC<INavbar> = () => {
  const { dispatch } = useGlobal();
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getTabs(activeMarketFromStorage),
    [activeMarketFromStorage]
  );
  const VISIBLETABS = isTestnet ? 6 : 6;
  // const MORETABS = isTestnet ? 2 : 3;
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  const { openOngoingTradesShutter, shutterState } = useShutterHandlers();
  const [activeTrades, limitOrderTrades] = useOngoingTrades();
  const navigate = useNavigate();
  const [click, setClick] = useState(0);
  const openAdmin = () => {
    setClick((click) => {
      if (click > 5) {
        navigate('/admin');
      }
      return click + 1;
    });
  };
  const show = !urlSettings?.hide;
  return (
    <header className="  sticky bg-[#232334] top-[0px] flex justify-between w-full h-[45px] pr-[8px] header top-0 z-[102] b1200:z-10">
      <OneCTModal />
      <div className="flex items-center ">
        <div
          role={'button'}
          onClick={() => window.open('https://buffer.finance/', '_blank')}
          className="b1200:hidden"
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
          <div className="b1200:hidden flex gap-[6px] ml-4 ">
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
        {inIframe() && (
          <button
            onClick={openAdmin}
            className="bg-transparent w-[100px] h-[35px]"
          ></button>
        )}
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
