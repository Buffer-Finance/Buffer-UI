import { useQTinfo } from '@Views/BinaryOptions';
import PGDesktopTables from '@Views/BinaryOptions/Tables/Desktop';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useHistoryTableTabs } from '@Views/Profile/Components/HistoryTable';
import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useAllfilteredData } from './useAllfilteredData';

export const AllTradesPage = () => {
  return (
    <main className="content-drawer">
      <AllTrades />
    </main>
  );
};

export const allATrdesTotalPageAtom = atom<{
  active: number;
  history: number;
  cancelled: number;
}>({
  active: 1,
  history: 1,
  cancelled: 1,
});

const AllTrades = () => {
  const { activeTrades, historyTrades, cancelledTrades } = useAllfilteredData();
  console.log(cancelledTrades, 'cancelledTrades');
  const qtInfo = useQTinfo();
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();
  const [totalPages, setTotalPages] = useAtom(allATrdesTotalPageAtom);

  useEffect(() => {
    changeActiveTab(null, 0);
  }, []);

  return (
    <div className="px-7 my-8 sm:px-3">
      {' '}
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
          <PGDesktopTables
            activePage={totalPages.active}
            configData={qtInfo}
            filteredData={activeTrades}
            shouldNotDisplayShareVisulise
            totalPages={1}
            onPageChange={(e, p) => setTotalPages({ ...totalPages, active: p })}
            showUserAddress
            widths={['auto']}
          />,
          <PGDesktopTables
            activePage={totalPages.history}
            configData={qtInfo}
            filteredData={historyTrades}
            shouldNotDisplayShareVisulise
            totalPages={500}
            onPageChange={(e, p) =>
              setTotalPages({ ...totalPages, history: p })
            }
            showUserAddress
            widths={[
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              '9%',
              'auto',
            ]}
          />,
          <PGDesktopTables
            activePage={totalPages.cancelled}
            configData={qtInfo}
            filteredData={cancelledTrades}
            shouldNotDisplayShareVisulise
            totalPages={50}
            onPageChange={(e, p) =>
              setTotalPages({ ...totalPages, cancelled: p })
            }
            showUserAddress
            widths={['auto']}
          />,
        ]}
      />
    </div>
  );
};
