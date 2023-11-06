import { NavLink, useLocation } from 'react-router-dom';
import { ITab } from 'src/Config/getTabs';

export const Tab = ({ tab }: { tab: ITab }) => {
  const location = useLocation();
  return (
    <NavLink
      key={tab.name}
      to={tab.to}
      className={({ isActive }) => {
        return `transition-all duration-300 text-4 text-f15  px-4 py-[4px] rounded-[8px] ${
          isActive ||
          (location.pathname.includes('binary') &&
            tab.name.toLowerCase() == 'trade') ||
          (location.pathname.includes('no-loss') &&
            tab.name.toLowerCase() == 'no loss')
            ? 'text-1 bg-3'
            : 'hover:bg-1 hover:text-1 hover:brightness-125'
        } 
          `;
      }}
    >
      {tab.name}
    </NavLink>
  );
};
