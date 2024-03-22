import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { getMobileTabs, getTabs } from 'src/Config/getTabs';
import { Link, useLocation } from 'react-router-dom';
import { useGlobal } from '@Contexts/Global';
import { activeMarketFromStorageAtom } from 'src/globalStore';

const BaseTab = ({
  tab,
  active,
  horizontal,
  className,
  onClick,
}: {
  tab: Partial<ReturnType<typeof getTabs>[0]>;
  active?: boolean;
  horizontal?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  const Btn = (
    <div
      className={`flex ${
        !horizontal && 'flex-col'
      } items-center content-center text-f12 text-${
        active ? '1' : '2'
      } ${className}`}
      onClick={onClick}
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
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M6 13H20"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M6 18H20"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const MobileBottomTabs: React.FC<any> = ({}) => {
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const tabs = useMemo(
    () => getMobileTabs(activeMarketFromStorage),
    [activeMarketFromStorage]
  );
  const location = useLocation();
  const isActive = (t: any) => {
    let tabName = t.to.split('/')[1];
    if (tabName == 'trade') {
      tabName = 'binary';
    }
    if (tabName)
      return location.pathname.toLowerCase().includes(tabName.toLowerCase());
    return false;
  };
  const areExtraTabs = tabs.length > mobleMaxTabLimit;
  const limit = areExtraTabs ? 4 : tabs.length;
  const { dispatch } = useGlobal();
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  return (
    <div className="bg-1 fixed bottom-[0px] w-full z-10 nsm:hidden mobile-bottom-drawer flex items-center pt-[5px] pb-[8px] justify-between px-3">
      {tabs.slice(0, limit).map((t) => (
        <BaseTab key={t.name} tab={t} active={isActive(t)} />
      ))}{' '}
      {areExtraTabs && (
        <BaseTab tab={{ name: 'More', icon: MoreIcon }} onClick={handleClose} />
      )}
    </div>
  );
};

export { MobileBottomTabs };
