import { useQTinfo } from '@Views/BinaryOptions';
import PGDesktopTables from '@Views/BinaryOptions/Tables/Desktop';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useHistoryTableTabs } from '@Views/Profile/Components/HistoryTable';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const qtInfo = useQTinfo();
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();
  const [totalPages, setTotalPages] = useAtom(allATrdesTotalPageAtom);
  const navigate = useNavigate();

  useEffect(() => {
    changeActiveTab(null, 0);
  }, []);

  const navigateToProfile = (address: string | undefined | null) => {
    if (address === undefined || address === null) return;
    navigate(`/profile?user_address=${address}`);
  };

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
            shouldShowMobile
            totalPages={1}
            onPageChange={(e, p) => setTotalPages({ ...totalPages, active: p })}
            showUserAddress
            widths={['auto']}
            onRowClick={(index) =>
              navigateToProfile(activeTrades[index].user.address)
            }
          />,
          <PGDesktopTables
            activePage={totalPages.history}
            configData={qtInfo}
            filteredData={historyTrades}
            shouldNotDisplayShareVisulise
            shouldShowMobile
            totalPages={500}
            onPageChange={(e, p) =>
              setTotalPages({ ...totalPages, history: p })
            }
            onRowClick={(index) =>
              navigateToProfile(historyTrades[index].user.address)
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
            shouldShowMobile
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
