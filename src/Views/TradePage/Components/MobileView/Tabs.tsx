import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { BlueBtn } from '@Views/Common/V2-Button';
import { atom, useAtom } from 'jotai';
import { PlatformEvents } from '@Views/TradePage/PlatformTradesTab';
import { MultiResolutionChart } from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';

export const Tabs = () => {
  const { activeMarket } = useActiveMarket();

  const [activeTab, setActiveTab] = useAtom(mobileTradePageTabs);
  return (
    <div>
      {/* <div className="flex items-center gap-[20px] ">
        {['trade'].map((tab) => {
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
      </div> */}
      <HorizontalTransition value={activeTab === 'trade' ? 0 : 1}>
        {activeMarket ? (
          <MultiResolutionChart
            key={activeMarket.tv_id}
            market={activeMarket.tv_id}
            index={1}
            isMobile
          />
        ) : null}
        <PlatformEvents />{' '}
      </HorizontalTransition>
    </div>
  );
};
const mobileTradePageTabs = atom<'trade' | 'chart'>('trade');
