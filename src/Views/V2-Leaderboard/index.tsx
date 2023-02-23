import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LeaderBoardDrawers } from './drawers';
import { LeaderBoardSidebar, MobileLeaderboardDropdwon } from './Sidebar';
import { LeaderBoardStyles } from './style';

export const LeaderBoard = (props: { children: JSX.Element }) => {
  return (
    <main className="content-drawer">
      <LeaderBoardStyles>
        <MobileLeaderboardDropdwon />
        <LeaderBoardSidebar />
        {props.children}
      </LeaderBoardStyles>
      {typeof window === 'undefined' ? (
        <LeaderBoardDrawers />
      ) : (
        window.innerWidth > 600 && <LeaderBoardDrawers />
      )}{' '}
    </main>
  );
};

export function getPageNumber(router: any) {
  const page = router.asPath.split('=')[1];
  return +page;
}

export const LeaderBoardOutlet = () => {
  useEffect(() => {
    document.title = 'Buffer | Competitions';
  }, []);
  return <Outlet />;
};
