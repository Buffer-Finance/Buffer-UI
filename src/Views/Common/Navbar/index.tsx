import { useGlobal } from '@Contexts/Global';
import MemoHamburgerSVG from '@SVG/Elements/HamburgerSVG2';
import MemoWalletSVG from '@SVG/Elements/WalletSVG';
import { useShutterHandlers } from '@Views/NoLoss-V3/Components/Trade/MobileTradePage/Shutters';
import { tardesAtom } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { isTestnet } from 'config';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getTabs } from 'src/Config/getTabs';
import { urlSettings } from 'src/Config/wagmiClient';
import { activeMarketFromStorageAtom } from 'src/globalStore';
import { AccountDropdown } from './AccountDropdown';
import { BufferLogoComponent } from './BufferLogo';
import { SettingsDD } from './SettingsDD';
import { Tab } from './Tab';
import { TabsDropdown } from './TabsDropDown';

export const Navbar: React.FC = () => {
  const { dispatch } = useGlobal();
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getTabs(activeMarketFromStorage, false),
    [activeMarketFromStorage]
  );
  const VISIBLETABS = isTestnet ? 6 : 6;
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  const { openOngoingTradesShutter, shutterState } = useShutterHandlers();
  const { active } = useAtomValue(tardesAtom);
  const show = !urlSettings?.hide;
  return (
    <header className="  sticky bg-[#232334] top-[0px] flex justify-between w-full h-[45px] pr-[8px] header top-0 z-[102] b1200:z-10">
      {/* <OneCTModal /> */}
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
            count={active.length}
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

            {tabs.length > VISIBLETABS && (
              <TabsDropdown tabs={tabs.slice(VISIBLETABS)} defaultName="More" />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-[3px] whitespace-nowrap">
        <div id="dropdown-box" className="flex gap-4 items-center text-1">
          <AccountDropdown />
        </div>

        <SettingsDD />
      </div>
    </header>
  );
};
