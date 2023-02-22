import { activeMarketFromStorageAtom } from '@Views/BinaryOptions';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getTabs } from 'src/Config/getTabs';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { Link } from 'react-router-dom';

const BaseTab = ({
  tab,
  active,
  horizontal,
  className
}: {
  tab: Partial<ReturnType<typeof getTabs>[0]>;
  active?: boolean;
  horizontal?: boolean;
  className?:string;
}) => {
  const Btn = (
    <div
      className={`flex ${
        !horizontal && 'flex-col'
      } items-center content-center text-f12 text-${active ? '1' : '2'} ${className}`}
    >
      {tab.icon}
      {tab.name}
    </div>
  );
  if (tab.isExternalLink) {
    return (
      <a href={tab.to} style={{ all: 'unset' }} target="_blank">
        {Btn}
      </a>
    );
  }
  return <Link to={tab.to!}>{Btn}</Link>;
};

const mobleMaxTabLimit = 5;

const MoreIcon = (
  <svg
    width="38"
    height="38"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8.95455"
      cy="18.9545"
      r="2.95455"
      stroke="currentColor"
      stroke-width="2"
    />
    <circle
      cx="19.5004"
      cy="18.9545"
      r="2.95455"
      stroke="currentColor"
      stroke-width="2"
    />
    <circle
      cx="30.0454"
      cy="18.9545"
      r="2.95455"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
);

const MobileBottomTabs: React.FC<any> = ({}) => {
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getTabs(activeMarketFromStorage),
    [activeMarketFromStorage]
  );
  const isActive = (t: any) => {
    return false;
  };
  const areExtraTabs = tabs.length > mobleMaxTabLimit;
  const limit = areExtraTabs ? 4 : tabs.length;
  return (
    <div className="mobile-bottom-drawer flex items-center mb-3 justify-between mx-3">
      {tabs.slice(0, limit).map((t) => (
        <BaseTab tab={t} active={isActive(t)} />
      ))}{' '}
      {areExtraTabs && (
        <Menu
          menuButton={
            <MenuButton>
              <BaseTab tab={{ name: 'More', icon: MoreIcon }} />
            </MenuButton>
          }
          arrow
          transition
          theming="dark"
          className={'bg-1 '}
        >
          {tabs.slice(limit).map((t) => {
            return (
              <MenuItem className={'!px-2 !py-[0px]  '}>
               <BaseTab tab={t} horizontal className='text-[14px] child-svg-squeeze'/>
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </div>
  );
};

export { MobileBottomTabs };
