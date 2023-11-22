import { usePriceRetriable } from '@Hooks/usePrice';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useAtom } from 'jotai';
import { useNoLossMarkets } from '../Hooks/useNoLossMarkets';
import { AllActive } from './Active';
import { AllCancelled } from './Cancelled';
import { AllHistory } from './History';
import { Tabs } from './Tabs';
import { tabsAtom } from './atoms';

export const AllTrades = () => {
  useNoLossMarkets();
  usePriceRetriable();
  const [activeTab, setActiveTab] = useAtom(tabsAtom);

  return (
    <div className="p-3 w-full">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <HorizontalTransition value={activeTab}>
        <AllActive />
        <AllHistory />
        <AllCancelled />
      </HorizontalTransition>
    </div>
  );
};
