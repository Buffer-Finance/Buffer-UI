import { useAtom } from 'jotai';
import { activeTabAtom } from '../../Atoms/Admin';

export const Tabs = () => {
  const [tabs, setActiveTab] = useAtom(activeTabAtom);
  return (
    <div className="flex items-center gap-5 w-fit m-auto">
      {tabs.allTabs.map((tab) => {
        const isActive = tabs.activeTab === tab;
        return (
          <button
            onClick={() =>
              setActiveTab((prvState) => ({ ...prvState, activeTab: tab }))
            }
            className={`capitalize ${
              isActive ? 'text-1' : 'text-[#808191]'
            } text-f16`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
