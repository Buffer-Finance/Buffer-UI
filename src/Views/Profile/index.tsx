import { useGlobal } from '@Contexts/Global';
import { useQTinfo } from '@Views/BinaryOptions';
import {
  tardesPageAtom,
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
  usePastTradeQuery,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import PGTables from '@Views/BinaryOptions/Tables';
import { tradesCount } from '@Views/BinaryOptions/Tables/Desktop';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { ClaimedNFT } from '@Views/NFTView/Claimed';
import { binaryTabs } from 'config';
import { useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

export const ProfilePage = () => {
  return (
    <main className="content-drawer">
      <Profile />
    </main>
  );
};

const Profile = () => {
  return (
    <div>
      <HistoryTables />
      <ClaimedNFT />
    </div>
  );
};

const HistoryTables = () => {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  const qtInfo = useQTinfo();
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  const [
    { active: activePage, history: historyPage, cancelled: cancelledPage },
  ] = useAtom(tardesPageAtom);
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
            currentPage={activePage}
            count={tradesCount}
            onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
          />,
          <PGTables
            configData={qtInfo}
            currentPage={historyPage}
            count={tradesCount}
            onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
          />,
          <PGTables
            configData={qtInfo}
            currentPage={cancelledPage}
            count={tradesCount}
            onPageChange={(e, pageNumber) => setCancelledPage(pageNumber)}
          />,
        ]}
      />
    </>
  );
};
