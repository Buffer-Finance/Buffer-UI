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
  const qtInfo = useQTinfo();
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  const { active, history, cancelled } = useAtomValue(tardesPageAtom);
  const { viewOnlyMode } = useUserAccount();
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();
  usePastTradeQuery();

  useEffect(() => {
    changeActiveTab(null, 1);
    setActivePage(1);
    setHistoryPage(1);
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
            // icon: (
            //   <div className="ml-2 text-f12 border border-1 px-[6px] rounded bg-cross-bg text-3 font-thin translate-y-[1px]">
            //     Beta
            //   </div>
            // ),
          },
          { name: 'History' },
          // { name: 'Cancelled' },
        ]}
      />
      <TabSwitch
        value={activeTabIdx}
        childComponents={[
          <>
            <PGTables
              configData={qtInfo}
              currentPage={active}
              onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
              shouldNotDisplayShareVisulise={true}
            />{' '}
            <MobileOnly>
              <MobileTable
                activePage={active}
                configData={qtInfo}
                onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
                shouldNotDisplayShareVisulise={true}
              />
            </MobileOnly>
          </>,
          <>
            <PGTables
              currentPage={history}
              isHistoryTable
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
          </>,
          // <PGTables
          //   activePage={cancelled}
          //   configData={qtInfo}
          //   onPageChange={(e, pageNumber) => setCancelledPage(pageNumber)}
          // />,
        ]}
      />
      {/* <PGTables
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
      </MobileOnly> */}
    </>
  );
};

function MobileOnly({ children }) {
  if (typeof window === 'undefined') return null;
  if (window.innerWidth > 1200) return null;
  return <>{children}</>;
}
