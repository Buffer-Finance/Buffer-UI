import { binaryTabs } from 'config';
import { useGlobal } from '@Contexts/Global';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useQTinfo } from '@Views/BinaryOptions';
import {
  tardesPageAtom,
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
} from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { DrawerChild } from '@Views/BinaryOptions/PGDrawer/DrawerChild';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import MobileTable from './historyTab';
import TVIntegrated from '@TV/TV';
export const MobileScreens = () => {
  const { state } = useGlobal();
  const qtInfo = useQTinfo();
  const activeTab = state.tabs.activeIdx;
  const activeTabIdx = useMemo(
    () => binaryTabs.findIndex((tab) => tab === activeTab),
    [state.tabs.activeIdx]
  );
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  const { active, history, cancelled } = useAtomValue(tardesPageAtom);

  console.log(`activeTabIdx: `, activeTabIdx);
  return (
    <>
      <div style={{ display: activeTabIdx == 0 ? 'block' : 'none' }}>
        <DrawerChild />
      </div>
      <div style={{ display: activeTabIdx == 1 ? 'block' : 'none' }}>
        <TVIntegrated assetInfo={qtInfo.activePair} />
      </div>
      <div style={{ display: activeTabIdx == 2 ? 'block' : 'none' }}>
        <MobileTable
          configData={qtInfo}
          activePage={active}
          onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
        />
      </div>
      <div style={{ display: activeTabIdx == 3 ? 'block' : 'none' }}>
        <MobileTable
          isHistoryTab
          configData={qtInfo}
          activePage={history}
          onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
        />
      </div>
      <div style={{ display: activeTabIdx == 4 ? 'block' : 'none' }}>
        <MobileTable
          isCancelledTab
          configData={qtInfo}
          activePage={cancelled}
          onPageChange={(e, pageNumber) => setCancelledPage(pageNumber)}
        />
      </div>
    </>
  );
};
