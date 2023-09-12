import { useActiveChain } from '@Hooks/useActiveChain';
import rawConfigs from '@Views/AdminConfigs/AdminConfigs.json';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { useState } from 'react';
import { ConfigSetter } from './ConfigSetter';
import { raw2adminConfig } from './helpers';
const groups = Object.keys(rawConfigs);
const className = 'bg-blue bg-4';
const AdminConfig: React.FC<any> = ({}) => {
  const marketConfig = useMarketsConfig();
  const { activeChain } = useActiveChain();
  const adminConfig = raw2adminConfig(marketConfig, activeChain);
  console.log(adminConfig, 'adminConfig');
  const [activeGroup, setActiveGroup] = useState(groups[1]);
  if (!adminConfig?.options_config) return <div>Loading...</div>;

  return (
    <div>
      <div className="text-f12 text-2 mt-4">
        Tip: Page is fully accessible via keyboard for a faster experience. Use
        Tab for switching between fields, "Enter" on inputs for launching
        transactions.
      </div>
      <div className="px-3 mt-4 flex flex-col gap-y-5">
        <div className="flex ml-2 text-f14 ">
          <div>Config group&nbsp;:&nbsp;</div>
          <select
            value={activeGroup}
            className="bg-[#2b3054] rounded-md p-2"
            onChange={(e) => setActiveGroup(e.target.value)}
          >
            {groups.map((g) => (
              <option
                key={g}
                className={`p-2  cursor-pointer ${
                  g == activeGroup ? 'bg-blue' : 'bg-4'
                }`}
                onClick={(e) => {
                  setActiveGroup(g);
                }}
              >
                {g}
              </option>
            ))}
          </select>
        </div>
        <ConfigSetter
          configs={adminConfig[activeGroup as keyof typeof adminConfig]}
          cacheKey={activeGroup}
        />
      </div>
    </div>
  );
};

export { AdminConfig };
