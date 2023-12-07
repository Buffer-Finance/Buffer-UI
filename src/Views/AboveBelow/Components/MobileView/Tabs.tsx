import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { BlueBtn } from '@Views/Common/V2-Button';
import { atom, useAtom } from 'jotai';
import { BuyTrade } from '../BuyTrade';
import { MarketChart } from '../MarketChart';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useAtom(mobileTradePageTabs);
  return (
    <div>
      <div className="flex items-center gap-[20px] mb-3">
        {['trade', 'Price chart'].map((tab) => {
          const activeTabClass =
            tab.toLowerCase() === activeTab.toLowerCase()
              ? 'text-1'
              : 'text-[#808191]';
          return (
            <button
              className={`capitalize text-f14 font-medium ${activeTabClass}`}
              onClick={() =>
                setActiveTab(tab.toLowerCase() as 'trade' | 'chart')
              }
              key={tab}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <HorizontalTransition value={activeTab === 'trade' ? 0 : 1}>
        <BuyTrade isMobile />
        <Chart navigateToTrade={() => setActiveTab('trade')} />
      </HorizontalTransition>
    </div>
  );
};
export const mobileTradePageTabs = atom<'trade' | 'chart'>('trade');

function Chart({ navigateToTrade }: { navigateToTrade: () => void }) {
  return (
    <div>
      <MarketChart />
      <BlueBtn onClick={navigateToTrade} className="mt-3">
        Place Trade
      </BlueBtn>
    </div>
  );
}
