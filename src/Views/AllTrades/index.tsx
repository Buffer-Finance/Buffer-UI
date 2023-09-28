import { usePrice } from '@Hooks/usePrice';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import {
  PlatformHistory,
  PlatformOngoing,
} from '@Views/TradePage/Views/AccordionTable';
import { useMemo } from 'react';
import { useAllTradesTab } from './useAlltradesTab';

export const AllTrades = () => {
  const { setTab, tab } = useAllTradesTab();
  useBuyTradeData();
  usePrice();

  const tabs = ['active', 'history'];
  const currentTab = useMemo(() => {
    if (tab !== null) {
      return tab;
    }
    return tabs[0];
  }, [tab]);

  const table = useMemo(() => {
    if (currentTab.toLowerCase() === 'active') {
      return <PlatformOngoing />;
    }
    if (currentTab.toLowerCase() === 'history') {
      return <PlatformHistory className="sm:min-w-[800px]" overflow={false} />;
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
