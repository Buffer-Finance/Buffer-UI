import { useGenericHooks } from '@Hooks/useGenericHook';
import { usePrice } from '@Hooks/usePrice';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useAtom } from 'jotai';
import { ReactNode, useState } from 'react';
import { useQTinfo } from '.';
import MobileTable from './Components/Mobile/historyTab';
import { ShareModal } from './Components/shareModal';
import {
  updateActivePageNumber,
  updateCancelledPageNumber,
  updateHistoryPageNumber,
  usePastTradeQuery,
} from './Hooks/usePastTradeQuery';

interface IHistory {}
const tabs = ['Active', 'History', 'Cancelled'];
const History: React.FC<IHistory> = ({}) => {
  const [, setHistoryPage] = useAtom(updateHistoryPageNumber);
  const [, setActivePage] = useAtom(updateActivePageNumber);
  const [, setCancelledPage] = useAtom(updateCancelledPageNumber);
  usePastTradeQuery();
  useGenericHooks();
  usePrice();
  const qtInfo = useQTinfo();
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="text-f22">
      <ShareModal qtInfo={qtInfo} />

      <MobileTabs {...{ active, setActive, tabs }}></MobileTabs>
      <HorizontalTransition value={tabs.indexOf(active)}>
        <MobileTable
          onPageChange={(e, pageNumber) => setActivePage(pageNumber)}
        />
        <MobileTable
          isHistoryTab
          onPageChange={(e, pageNumber) => setHistoryPage(pageNumber)}
        />
        <MobileTable
          isCancelledTab
          onPageChange={(e, pageNumber) => setCancelledPage(pageNumber)}
        />
      </HorizontalTransition>
    </div>
  );
};

export { History };

const MobileTabs: React.FC<{
  tabs: string[];
  active: string;
  setActive: (a: string) => void;
}> = ({ tabs, active, setActive }) => {
  console.log(`active: `, active);
  return (
    <div className="bg-2   flex justify-between mx-3 rounded-lg mb-3 mt-3">
      {tabs.map((t) => (
        <div
          className={`rounded-lg  w-full text-f16 text-2 py-[6px] ${
            t == active ? 'bg-grey text-1' : ''
          } text-center`}
          onClick={() => setActive(t)}
        >
          {t}
        </div>
      ))}
    </div>
  );
};
