import { useActiveChain } from '@Hooks/useActiveChain';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { raw2adminConfig } from './helpers';
import rawConfigs from '@Views/AdminConfigs/AdminConfigs.json';
import { useState } from 'react';
import { ConfigSetter } from './ConfigSetter';
const groups = Object.keys(rawConfigs);
const className = 'bg-green';
const AdminConfig: React.FC<any> = ({}) => {
  const marketConfig = useMarketsConfig();
  const { activeChain } = useActiveChain();
  const adminConfig = raw2adminConfig(marketConfig, activeChain);
  const [activeGroup, setActiveGroup] = useState(groups[0]);
  if (!adminConfig?.options_config) return <div>'Loading...'</div>;

  return (
    <div>
      {groups.map((g) => (
        <div
          key={g}
          className={g == activeGroup ? 'bg-blue' : 'bg-green'}
          onClick={(e) => {
            setActiveGroup(g);
          }}
        >
          {g}
        </div>
      ))}
      <ConfigSetter
        configs={adminConfig[activeGroup as keyof typeof adminConfig]}
      />
    </div>
  );
};

export { AdminConfig };
