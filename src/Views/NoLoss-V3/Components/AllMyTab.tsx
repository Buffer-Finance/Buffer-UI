import { useAtom } from 'jotai';
import { activeMyAllTabAtom } from '../atoms';
import { Star } from './SVGs/Star';
import { Trophy } from './SVGs/Trophy';
const tabs = [
  {
    title: 'my',
    icon: <Star />,
  },
  {
    title: 'all',
    icon: <Trophy />,
  },
];
export const AllMyTab: React.FC = () => {
  const [activeTab, setActiveTab] = useAtom(activeMyAllTabAtom);
  return (
    <div className="flex items-center gap-2 bg-[#282B39] rounded-[3px] w-fit p-2 mb-3">
      {tabs.map((tab) => {
        const tabClasses =
          activeTab.toLowerCase() === tab.title ? 'bg-[#141823]' : '';
        return (
          <button
            className={`flex items-center text-f12 gap-2 capitalize px-2 ${tabClasses}`}
            onClick={() => setActiveTab(tab.title)}
          >
            <div>{tab.title}</div>
            {tab.icon}
          </button>
        );
      })}
    </div>
  );
};
