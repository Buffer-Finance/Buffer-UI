import { useActiveChain } from '@Hooks/useActiveChain';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { tokenAtom } from '@Views/DashboardV2/atoms';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

export const PoolSelectorRadio = () => {
  const { activeChain } = useActiveChain();
  const tabList = usePoolNames();
  const [activeToken, setActiveToken] = useAtom(tokenAtom);
  const { poolDisplayKeyMapping } = usePoolDisplayNames();

  useEffect(() => {
    setActiveToken([...tabList]);
  }, [activeChain]);

  function onCheckChange(tokenName: string) {
    const isTokenActive = activeToken.find((tab) => tab === tokenName);
    if (isTokenActive)
      setActiveToken(activeToken.filter((tab) => tab !== tokenName));
    else setActiveToken([...activeToken, tokenName]);
  }
  if (tabList.length < 2) return <></>;
  return (
    <div className="flex items-center gap-5">
      {' '}
      {tabList.map((tab) => {
        const isActive = activeToken.includes(tab);
        return (
          <div className="flex items-center gap-2" key={tab}>
            <BufferCheckbox
              svgClasses="h-4 w-4"
              checked={isActive}
              onCheckChange={() => onCheckChange(tab)}
            />
            <div
              className={`text-f15 font-medium ${
                isActive ? 'text-1' : 'text-3'
              }`}
            >
              {poolDisplayKeyMapping[tab]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
