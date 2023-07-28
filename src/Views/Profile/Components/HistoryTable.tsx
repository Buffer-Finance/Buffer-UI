import { useGlobal } from '@Contexts/Global';
import {
  updateActivePageNumber,
  updateHistoryPageNumber,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { History } from '@Views/TradePage/Views/AccordionTable';
import LimitOrderTable from '@Views/TradePage/Views/AccordionTable/LimitOrderTable';
import { OngoingTradesTable } from '@Views/TradePage/Views/AccordionTable/OngoingTradesTable';
import { binaryTabs } from 'config';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

export const useHistoryTableTabs = () => {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;

  const activeTabIdx = useMemo(
    () => binaryTabs.findIndex((tab) => tab === activeTab) - 2,
    [state.tabs.activeIdx]
  );

  const changeActiveTab = (e, pageNumber: number) =>
    dispatch({
      type: 'SET_ACIVE_TAB',
      payload: binaryTabs[pageNumber + 2], //Runs only for web. Hence 0 & 1 tab neglected.
    });
  return { activeTabIdx, changeActiveTab };
};

export const HistoryTables = () => {
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();

  useEffect(() => {
    changeActiveTab(null, 1);
    setActivePage(1);
    setHistoryPage(1);
  }, []);

  const [activeTrades, limitOrders] = useOngoingTrades();

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
        childComponents={[
          <OngoingTradesTable trades={activeTrades} />,
          <LimitOrderTable trades={limitOrders} />,
          <History />,
        ]}
      />
    </>
  );
};

function MobileOnly({ children }) {
  if (typeof window === 'undefined') return null;
  if (window.innerWidth > 1200) return null;
  return <>{children}</>;
}
