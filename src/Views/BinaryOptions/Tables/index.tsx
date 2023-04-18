import { useGlobal } from '@Contexts/Global';
import { useAtomValue } from 'jotai';
import { ChangeEvent, useMemo } from 'react';
import { IQTrade } from '..';
import { tardesAtom, tardesTotalPageAtom } from '../Hooks/usePastTradeQuery';
import PGDesktopTables from './Desktop';

interface IPGTables {
  configData: IQTrade;
  count?: number;
  currentPage?: number;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  className?: string;
  isHistoryTable?: boolean;
  shouldFetchOldData?: boolean;
  shouldNotDisplayShareVisulise?: boolean;
}

const PGTables: React.FC<IPGTables> = ({
  configData,
  className,
  count,
  onPageChange,
  currentPage,
  shouldFetchOldData,
  shouldNotDisplayShareVisulise,
}) => {
  const { active, history, cancelled } = useAtomValue(tardesAtom);
  const {
    active: activePages,
    history: historyPages,
    cancelled: cancelledPages,
  } = useAtomValue(tardesTotalPageAtom);
  const { state } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  const isHistoryTable = activeTab === 'History';
  const isCancelledTable = activeTab === 'Cancelled';
  const totalPages = useMemo(() => {
    if (isHistoryTable) {
      return historyPages;
    } else if (isCancelledTable) {
      return cancelledPages;
    } else return activePages;
  }, [activePages, historyPages, cancelledPages, activeTab]);

  const filteredData = useMemo(() => {
    if (isHistoryTable) {
      return history;
    } else if (isCancelledTable) {
      return cancelled;
    } else return active;
  }, [activeTab, active, history]);

  // console.log(filteredData, 'filteredData');
  return (
    <>
      {/* <BufferDisclaimer
        content={
          "Due to network congestion the changes will show up in some time (<1min)"
        }
      /> */}
      <PGDesktopTables
        className=""
        isHistoryTable={isHistoryTable}
        configData={configData}
        count={count}
        onPageChange={onPageChange}
        activePage={currentPage}
        shouldNotDisplayShareVisulise={shouldNotDisplayShareVisulise}
        filteredData={filteredData}
        totalPages={totalPages}
        widths={
          isHistoryTable
            ? [
                'auto',
                'auto',
                'auto',
                'auto',
                'auto',
                'auto',
                'auto',
                '12%',
                '10%',
                '3%',
              ]
            : ['auto']
        }
        currentPage={currentPage}
        shouldFetchOldData={shouldFetchOldData}
      />
    </>
  );
};

export default PGTables;
