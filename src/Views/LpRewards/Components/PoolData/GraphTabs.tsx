import { graphsType, poolsType } from '@Views/LpRewards/types';

export const GraphTabs: React.FC<{
  activeTab: graphsType;
  setActiveTab: (tab: graphsType) => void;
  activePool: poolsType;
}> = ({ activeTab, setActiveTab, activePool }) => {
  return (
    <div className="flex items-center gap-6">
      {[
        activePool === 'uBLP' ? 'uBLP Price' : 'aBLP Price',
        'TVL',
        // 'APR',
        // 'PnL',
      ].map((tab) => {
        const tabName = tab === 'uBLP Price' ? 'price' : tab.toLowerCase();
        const isActiveTab = activeTab.toLowerCase() === tabName;
        return (
          <div
            key={tab}
            className={`cursor-pointer  font-medium text-f16 leading-[18px] ${
              isActiveTab
                ? 'bg-[#2B2B37] py-2 px-3 rounded-sm text-1'
                : 'text-[#7F87A7]'
            }`}
            onClick={() => setActiveTab(tabName as graphsType)}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};
