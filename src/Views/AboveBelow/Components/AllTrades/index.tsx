import { usePriceRetriable } from '@Hooks/usePrice';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useAtom } from 'jotai';
// import { useNoLossMarkets } from '../Hooks/useNoLossMarkets';
import { AllActive } from './Active';
import { AllCancelled } from './Cancelled';
import { AllHistory } from './History';
// import { AllQueued } from './Queued';
import { useAboveBelowMarketsSetter } from '@Views/AboveBelow/Hooks/useAboveBelowMarketsSetter';
import { Tabs } from './Tabs';
import { tabsAtom } from './atoms';

export const AllTrades = () => {
  useAboveBelowMarketsSetter();
  usePriceRetriable();
  const [activeTab, setActiveTab] = useAtom(tabsAtom);

  return (
    <div className="p-3 w-full">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <HorizontalTransition value={activeTab}>
        {/* <AllQueued /> */}
        <AllActive />
        <AllHistory />
        <AllCancelled />
      </HorizontalTransition>
    </div>
  );
};
