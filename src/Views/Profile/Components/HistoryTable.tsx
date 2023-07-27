import { useGlobal } from '@Contexts/Global';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { HistoryTable } from '@Views/TradePage/Views/AccordionTable/HistoryTable';
import LimitOrderTable from '@Views/TradePage/Views/AccordionTable/LimitOrderTable';
import { OngoingTradesTable } from '@Views/TradePage/Views/AccordionTable/OngoingTradesTable';
import { binaryTabs } from 'config';
import { useEffect, useMemo } from 'react';

export const useHistoryTableTabs = () => {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;

  const activeTabIdx = useMemo(
    () => binaryTabs.findIndex((tab) => tab === activeTab) - 2,
    [state.tabs.activeIdx]
  );

  const changeActiveTab = (e: any, pageNumber: number) =>
    dispatch({
      type: 'SET_ACIVE_TAB',
      payload: binaryTabs[pageNumber + 2], //Runs only for web. Hence 0 & 1 tab neglected.
    });
  return { activeTabIdx, changeActiveTab };
};

export const HistoryTables = () => {
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();

  useEffect(() => {
    changeActiveTab(null, 1);
  }, []);

  return (
    <>
      <BufferTab
        value={activeTabIdx}
        handleChange={(e, t) => {
          changeActiveTab(e, t);
        }}
        className="mb-5"
        tablist={[
          {
            name: 'Active',
          },
          { name: 'Limit Orders' },
          { name: 'History' },
        ]}
      />
      <TabSwitch
        value={activeTabIdx}
        childComponents={[<OnGoing />, <LimitOrder />, <History />]}
      />
    </>
  );
};
const OnGoing = () => {
  const [activeTrades] = useOngoingTrades();

  return <OngoingTradesTable trades={activeTrades} />;
};

const LimitOrder = () => {
  const [_, limitOrders] = useOngoingTrades();

  return <LimitOrderTable trades={limitOrders} />;
};

const History = () => {
  const [historyTrades] = useHistoryTrades();

  return <HistoryTable trades={historyTrades} />;
};

function MobileOnly({ children }: { children: React.ReactNode }) {
  if (typeof window === 'undefined') return null;
  if (window.innerWidth > 1200) return null;
  return <>{children}</>;
}
