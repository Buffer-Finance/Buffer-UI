import { usePriceRetriable } from '@Hooks/usePrice';
import {
  MobilePlatformHistoryTable,
  MobilePlatformOngoingTable,
} from '@Views/TradePage/Components/MobileView/TradeLog_sm';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import {
  PlatformHistory,
  PlatformOngoing,
  PlatfromCancelled,
} from '@Views/TradePage/Views/AccordionTable';
import { useMemo } from 'react';
import { useMedia } from 'react-use';
import { useAllTradesTab } from './useAlltradesTab';

export const AllTrades = () => {
  const { setTab, tab } = useAllTradesTab();
  const isNotMobile = useMedia('(min-width:1200px)');

  usePriceRetriable();

  const tabs = ['active', 'history', 'cancelled'];
  const currentTab = useMemo(() => {
    if (tab !== null) {
      return tab;
    }
    return tabs[0];
  }, [tab]);

  const table = useMemo(() => {
    if (currentTab.toLowerCase() === 'active') {
      return isNotMobile ? (
        <PlatformOngoing overflow={false} />
      ) : (
        <MobilePlatformOngoingTable />
      );
    }
    if (currentTab.toLowerCase() === 'history') {
      return isNotMobile ? (
        <PlatformHistory className="sm:min-w-[800px]" overflow={false} />
      ) : (
        <MobilePlatformHistoryTable />
      );
    }
    if (currentTab.toLowerCase() === 'cancelled') {
      return <PlatfromCancelled overflow={false} />;
    }
    return <>select a tab</>;
  }, [currentTab]);
  return (
    <div className="w-full">
      <div className="flex gap-3 my-4 mx-5">
        {tabs.map((tab) => {
          const isActiveTab = tab.toLowerCase() === currentTab.toLowerCase();
          return (
            <button
              className={`text-f18 ${
                isActiveTab ? 'text-1' : 'text-[#808191]'
              } capitalize`}
              key={tab}
              onClick={() => setTab(tab)}
            >
              Platform {tab}
            </button>
          );
        })}
      </div>
      {table}
    </div>
  );
};
