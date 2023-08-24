import DDArrow from '@SVG/Elements/Arrow';
import DDIcon from '@SVG/Elements/DDIcon';
import {
  Cancelled,
  History,
  PlatformHistory,
  PlatformOngoing,
} from '@Views/TradePage/Views/AccordionTable';
import {
  selectedOrderToEditAtom,
  tradeInspectMobileAtom,
} from '@Views/TradePage/atoms';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { TradeInspect_sm } from './TradeInspect_sm';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { ShareModal } from '@Views/TradePage/Views/AccordionTable/ShareModal';
import ShutterProvider, {
  useShutterHandlers,
} from '@Views/Common/MobileShutter/MobileShutter';
import MemoCheckMark from '@SVG/Elements/CheckMark';
import { EditModal } from '@Views/TradePage/Views/EditModal';
import { EssentialModals } from '@Views/TradePage';

const renderTab = (s) => (s.includes(':') ? s.split(':')[0] : s);
const tabs = ['History', 'Cancelled:b', 'Platform Trades', 'Platform History'];
export const activeTabAtom = atom<string>(tabs[0]);
const TradeLog_sm: React.FC<any> = ({}) => {
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const selectedTrade = useAtomValue(selectedOrderToEditAtom);
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);
  const markets = useMarketsConfig();
  function closeDropdown() {
    toggleMenu(false);
  }
  const inspectedTrade = useAtomValue(tradeInspectMobileAtom);
  const setInspectedTrade = useSetAtom(tradeInspectMobileAtom);
  useEffect(() => {
    setInspectedTrade({});
    return () => setInspectedTrade({});
  }, []);
  const { closeShutter } = useShutterHandlers();
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  useEffect(() => {
    closeShutter();
    return closeShutter;
  }, []);
  if (!markets?.length) {
    return <div>Loading..</div>;
  }

  const essntials = (
    <>
      <EssentialModals />
      <ShutterProvider />
      {inspectedTrade.trade && <TradeInspect_sm />}
    </>
  );

  return (
    <main className="w-full a600:w-[500px] mx-auto px-3 mt-4">
      {essntials}
      {!inspectedTrade.trade && (
        <>
          <button
            type="button"
            className="flex items-center  text-f14 text-1 !bg-[#232334] mx-3 mb-2 rounded-md px-4 py-2"
            ref={ref}
            {...anchorProps}
          >
            {renderTab(activeTab)} <DDArrow className=" scale-150 ml-4" />
          </button>
          <ControlledMenu
            {...menuState}
            anchorRef={ref}
            onClose={closeDropdown}
            viewScroll="initial"
            direction="bottom"
            position="anchor"
            align="end"
            portal
            menuClassName={
              '!p-3  !ml-3 !rounded-[10px] hover:!rounded-[10px] !bg-[#232334]'
            }
            offsetY={10}
          >
            {tabs.map((s) => {
              return (
                <MenuItem
                  key={s}
                  className={({ hover }) => {
                    return ` text-[#808191] !p-3 !py-2 flex flex-col !items-start ${
                      hover ? ' !rounded-[10px] !bg-[#232334]' : ' '
                    }`;
                  }}
                  onClick={(e: ClickEvent) => {
                    e.keepOpen = false;
                    setActiveTab(s);
                  }}
                >
                  <div
                    className={`flex gap-x-3 items-center text-f12 ${
                      activeTab == s ? 'text-1' : ''
                    } `}
                  >
                    <MemoCheckMark
                      className={
                        activeTab == s ? 'text-blue' : 'text-[#808191]'
                      }
                    />
                    {renderTab(s)}
                  </div>
                  {s.includes(':') && (
                    <div className="w-full m-auto bg-[#808191] mt-3 mb-2 opacity-50 max-h-[1px] h-[1px]"></div>
                  )}
                </MenuItem>
              );
            })}
          </ControlledMenu>
          {activeTab == 'History' && <History onlyView={[0, 6, 7, 8]} />}
          {activeTab == 'Platform History' && (
            <PlatformHistory onlyView={[0, 6, 7, 8]} />
          )}
          {activeTab == 'Platform Trades' && (
            <PlatformOngoing onlyView={[0, 1, 4, 6]} />
          )}
          {activeTab == 'Cancelled:b' && <Cancelled onlyView={[0, 1, 2, 4]} />}
        </>
      )}
    </main>
  );
};

export { TradeLog_sm };
