import { useGlobal } from '@Contexts/Global';
import { useQTinfo } from '@Views/BinaryOptions';
import {
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
  usePastTradeQuery,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import PGTables from '@Views/BinaryOptions/Tables';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { binaryTabs } from 'config';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

export const HistoryTables = () => {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  const qtInfo = useQTinfo();
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  const activeTabIdx = useMemo(
    () => binaryTabs.findIndex((tab) => tab === activeTab) - 2,
    [state.tabs.activeIdx]
  );
  usePastTradeQuery();

  const changeActiveTab = (e, pageNumber: number) =>
    dispatch({
      type: 'SET_ACIVE_TAB',
      payload: binaryTabs[pageNumber + 2], //Runs only for web. Hence 0 & 1 tab neglected.
    });

  useEffect(() => {
    changeActiveTab(null, 0);
  }, []);

  useEffect(() => {
    setActivePage(1);
    setCancelledPage(1);
    setHistoryPage(1);
  }, [activeTabIdx]);

  return (
    <>
      <BufferTab
        value={activeTabIdx}
        handleChange={(e, t) => {
          changeActiveTab(e, t);
        }}
        distance={5}
        className="mb-5"
        tablist={[
          { name: 'Active' },
          { name: 'History' },
          { name: 'Cancelled' },
        ]}
      />
      <TabSwitch
        value={activeTabIdx}
        childComponents={[
          <PGTables
            configData={qtInfo}
            onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
          />,
          <PGTables
            configData={qtInfo}
            onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
          />,
          <PGTables
            configData={qtInfo}
            onPageChange={(e, pageNumber) => setCancelledPage(pageNumber)}
          />,
        ]}
      />
    </>
  );
};
