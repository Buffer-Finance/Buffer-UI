import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useAtom } from 'jotai';
import { useNoLossMarkets } from '../Hooks/useNoLossMarkets';
import { AllCancelled } from './Cancelled';
import { AllHistory } from './History';
import { Tabs } from './Tabs';
import { tabsAtom } from './atoms';

export const AllTrades = () => {
  useNoLossMarkets();
  const [activeTab, setActiveTab] = useAtom(tabsAtom);

  return (
    <div className="p-3 w-full">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <HorizontalTransition value={activeTab}>
        <>active</>
        <AllHistory />
        <AllCancelled />
      </HorizontalTransition>
    </div>
  );
};
