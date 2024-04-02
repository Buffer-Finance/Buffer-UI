import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LeaderBoardDrawers } from './drawers';
import { LeaderBoardSidebar, MobileLeaderboardDropdwon } from './Sidebar';
import { LeaderBoardStyles } from './style';
import { TokenDataNotIncludedWarning } from '@Views/Common/TokenDataNotIncludedWarning';
export const LeaderBoard = (props: { children: JSX.Element }) => {
  return (
    // <ArbitrumOnly>
    <main className="content-drawer">
      <LeaderBoardStyles>
        <MobileLeaderboardDropdwon />
        <LeaderBoardSidebar />
        <div>
          {/* <TokenDataNotIncludedWarning /> */}
          {props.children}
        </div>
      </LeaderBoardStyles>
      {typeof window === 'undefined' ? (
        <LeaderBoardDrawers />
      ) : (
        window.innerWidth > 600 && <LeaderBoardDrawers />
      )}{' '}
    </main>
    // </ArbitrumOnly>
  );
};

export default LeaderBoard;
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
