import { usePrice } from '@Hooks/usePrice';
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
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();
  const [totalPages, setTotalPages] = useAtom(allATrdesTotalPageAtom);
  const navigate = useNavigate();
  usePrice();

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
            currentPage={totalPages.active}
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
            currentPage={totalPages.history}
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
            isHistoryTable
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
            currentPage={totalPages.cancelled}
            filteredData={cancelledTrades}
            shouldNotDisplayShareVisulise
            shouldShowMobile
            totalPages={50}
            onPageChange={(e, p) =>
              setTotalPages({ ...totalPages, cancelled: p })
            }
            onRowClick={(index) =>
              navigateToProfile(historyTrades[index].user.address)
            }
            showUserAddress
            isCancelledTable
            widths={['auto']}
          />,
        ]}
      />
    </div>
  );
};
