import { useActiveChain } from '@Hooks/useActiveChain';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { raw2adminConfig } from './helpers';
import rawConfigs from '@Views/AdminConfigs/AdminConfigs.json';
import { useState } from 'react';
import { ConfigSetter } from './ConfigSetter';
const groups = Object.keys(rawConfigs);
const className = 'bg-blue bg-4';
const AdminConfig: React.FC<any> = ({}) => {
  const marketConfig = useMarketsConfig();
  const { activeChain } = useActiveChain();
  const adminConfig = raw2adminConfig(marketConfig, activeChain);
  const [activeGroup, setActiveGroup] = useState(groups[1]);
  if (!adminConfig?.options_config) return <div>'Loading...'</div>;

  return (
    <div>
      <div className="flex ml-2 text-f14">
        <div>Select a group of contracts to edit config: </div>
        <div>
          {groups.map((g) => (
            <div
              key={g}
              className={`p-2  cursor-pointer ${
                g == activeGroup ? 'bg-blue' : 'bg-4'
              }`}
              onClick={(e) => {
                setActiveGroup(g);
              }}
            >
              {g}
            </div>
          ))}
        </div>
      </div>
      <ConfigSetter
        configs={adminConfig[activeGroup as keyof typeof adminConfig]}
        cacheKey={activeGroup}
      />
    </div>
  );
};

export { AdminConfig };
