import { activeMarketFromStorageAtom } from '@Views/BinaryOptions';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getTabs } from 'src/Config/getTabs';
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { Link, useLocation } from 'react-router-dom';

const BaseTab = ({
  tab,
  active,
  horizontal,
  className,
}: {
  tab: Partial<ReturnType<typeof getTabs>[0]>;
  active?: boolean;
  horizontal?: boolean;
  className?: string;
}) => {
  const Btn = (
    <div
      className={`flex ${
        !horizontal && 'flex-col'
      } items-center content-center text-f12 text-${
        active ? '1' : '2'
      } ${className}`}
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
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8H20"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
    />
    <path
      d="M6 13H20"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
    />
    <path
      d="M6 18H20"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
    />
  </svg>
);

const MobileBottomTabs: React.FC<any> = ({}) => {
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getTabs(activeMarketFromStorage),
    [activeMarketFromStorage]
  );
  const location = useLocation();
  const isActive = (t: any) => {
    let tabName = t.to.split('/')[1];
    
    console.log(`tabName: `,tabName);
    if (tabName == 'trade') {
      tabName = 'binary';
    }
    console.log(`tabName: `, tabName,location.pathname.toLowerCase());
    if (tabName)
      return location.pathname.toLowerCase().includes(tabName.toLowerCase());
    return false;
  };
  const areExtraTabs = tabs.length > mobleMaxTabLimit;
  const limit = areExtraTabs ? 4 : tabs.length;
  return (
    <div className="mobile-bottom-drawer flex items-center my-[5px] justify-between mx-3">
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
                <BaseTab
                  tab={t}
                  horizontal
                  className="text-[14px] child-svg-squeeze"
                />
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </div>
  );
};

export { MobileBottomTabs };
