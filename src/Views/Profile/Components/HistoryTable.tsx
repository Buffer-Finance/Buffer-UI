import { useGlobal } from '@Contexts/Global';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useQTinfo } from '@Views/BinaryOptions';
import MobileTable from '@Views/BinaryOptions/Components/Mobile/historyTab';
import {
  tardesPageAtom,
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
  usePastTradeQuery,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import PGTables from '@Views/BinaryOptions/Tables';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { binaryTabs } from 'config';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';

export const HistoryTables = () => {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  const qtInfo = useQTinfo();
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  const { active, history, cancelled } = useAtomValue(tardesPageAtom);
  const { viewOnlyMode } = useUserAccount();

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
    changeActiveTab(null, 1);
  }, []);

  return (
    <>
      {/* <BufferTab
        value={activeTabIdx}
        handleChange={(e, t) => {
          changeActiveTab(e, t);
        }}
        distance={5}
        className="mb-5"
        tablist={[
          // { name: 'Active' },
          { name: 'History' },
          // { name: 'Cancelled' },
        ]}
      />
      <TabSwitch
        value={activeTabIdx}
        childComponents={[
          <PGTables
            configData={qtInfo}
            activePage={active}
            onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
          />,
          <PGTables
            activePage={history}
            configData={qtInfo}
            onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
          />,
          <PGTables
            activePage={cancelled}
            configData={qtInfo}
            onPageChange={(e, pageNumber) => setCancelledPage(pageNumber)}
          />,
        ]}
      /> */}
      <PGTables
        activePage={history}
        configData={qtInfo}
        onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
        shouldNotDisplayShareVisulise={true}
      />
      <MobileOnly>
        <MobileTable
          activePage={history}
          configData={qtInfo}
          isHistoryTab
          onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
          shouldNotDisplayShareVisulise={true}
        />
      </MobileOnly>
    </>
  );
};

function MobileOnly({ children }) {
  if (typeof window === 'undefined') return null;
  if (window.innerWidth > 1200) return null;
  return <>{children}</>;
}
