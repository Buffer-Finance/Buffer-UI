import { usePriceRetriable } from '@Hooks/usePrice';
import ShutterProvider, {
  useShutterHandlers,
} from '@Views/Common/MobileShutter/MobileShutter';
import { EssentialModals } from '@Views/TradePage';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import {
  Cancelled,
  History,
  PlatformHistory,
  PlatformOngoing,
} from '@Views/TradePage/Views/AccordionTable';
import {
  Cancelled as CancelledAB,
  History as HistoryAB,
  PlatformHistory as PlatformHistoryAB,
  PlatformOngoing as PlatformOngoingAB,
} from '@Views/ABTradePage/Views/AccordionTable';
import {
  selectedOrderToEditAtom,
  tradeInspectMobileAtom,
} from '@Views/TradePage/atoms';
import { useClick, useMenuState } from '@szhsin/react-menu';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { TradeInspect_sm } from './TradeInspect_sm';

const renderTab = (s) => (s.includes(':') ? s.split(':')[0] : s);
const roottabs = ['Up/Down', 'Above/Below'];
const tabs = ['History', 'Cancelled:b', 'Platform Trades', 'Platform History'];
export const activeTabAtom = atom<string>(tabs[0]);
const TradeLog_sm: React.FC<any> = ({}) => {
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const selectedTrade = useAtomValue(selectedOrderToEditAtom);
  const [rootTab, setRootTab] = useState(roottabs[0]);
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
  usePriceRetriable();

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
      <div className="flex gap-2 text-[#C3C2D4]">
        {roottabs.map((s) => {
          return (
            <button
              className={`px-[10px] py-[2px] rounded-sm  text-f12 ${
                rootTab == s ? ' bg-[#282b39] text-1 font-[500] ' : ''
              }`}
              onClick={() => setRootTab(s)}
            >
              {s}
            </button>
          );
        })}
      </div>
      {!inspectedTrade.trade && (
        <>
          <div className="flex items-center gap-4 my-4">
            {tabs
              .filter((tab) => !tab.toLowerCase().includes('platform'))
              .map((tab) => {
                const isTabActive = activeTab == tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-f12 ${
                      isTabActive ? 'text-1' : 'text-[#808191]'
                    }`}
                  >
                    {renderTab(tab)}
                  </button>
                );
              })}
            <div className="text-[#808191] ">|</div>
            {tabs
              .filter((tab) => tab.toLowerCase().includes('platform'))
              .map((tab) => {
                const isTabActive = activeTab == tab;
                return (
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`text-f12 ${
                      isTabActive ? 'text-1' : 'text-[#808191]'
                    }`}
                  >
                    {renderTab(tab)}
                  </button>
                );
              })}
          </div>
          {activeTab == 'History' && <MobileHistoryTable rootTab={rootTab} />}
          {activeTab == 'Platform History' && (
            <MobilePlatformHistoryTable rootTab={rootTab} />
          )}
          {activeTab == 'Platform Trades' && (
            <MobilePlatformOngoingTable rootTab={rootTab} />
          )}
          {activeTab == 'Cancelled:b' && (
            <MobileCancelledTable rootTab={rootTab} />
          )}
        </>
      )}
    </main>
  );
};

export { TradeLog_sm };

export const MobileHistoryTable = ({ rootTab }) => {
  if (rootTab == 'Above/Below')
    return <HistoryAB onlyView={[0, 1, 7]} overflow={false} />;

  return <History onlyView={[0, 1, 7]} overflow={false} />;
};
export const MobilePlatformHistoryTable = ({ rootTab }) => {
  if (rootTab == 'Above/Below')
    return <PlatformHistoryAB onlyView={[0, 6, 7]} overflow={false} />;

  return <PlatformHistory onlyView={[0, 6, 7]} overflow={false} />;
};
export const MobilePlatformOngoingTable = ({ rootTab }) => {
  if (rootTab == 'Above/Below')
    return <PlatformOngoingAB onlyView={[0, 1, 6, 8]} />;

  return <PlatformOngoing onlyView={[0, 1, 6, 8]} />;
};
const MobileCancelledTable = ({ rootTab }) => {
  if (rootTab == 'Above/Below') return <CancelledAB onlyView={[0, 1, 2, 4]} />;

  return <Cancelled onlyView={[0, 1, 2, 4]} />;
};
