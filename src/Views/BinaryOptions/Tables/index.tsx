import { useGlobal } from '@Contexts/Global';
import { useAtomValue } from 'jotai';
import { ChangeEvent, useMemo } from 'react';
import { IQTrade } from '..';
import { tardesAtom, tardesTotalPageAtom } from '../Hooks/usePastTradeQuery';
import PGDesktopTables from './Desktop';

interface IPGTables {
  configData: IQTrade;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  activePage: number;
  shouldNotDisplayShareVisulise?: boolean;
}

const PGTables: React.FC<IPGTables> = ({
  configData,
  onPageChange,
  activePage,
  shouldNotDisplayShareVisulise = false,
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
  return (
    <>
      <PGDesktopTables
        configData={configData}
        onPageChange={onPageChange}
        activePage={activePage}
        shouldNotDisplayShareVisulise={shouldNotDisplayShareVisulise}
        filteredData={filteredData}
        totalPages={totalPages}
      />
    </>
  );
};

export default PGTables;
