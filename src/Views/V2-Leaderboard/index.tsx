import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LeaderBoardSidebar, MobileLeaderboardDropdwon } from './Sidebar';
import { LeaderBoardStyles } from './style';
export const LeaderBoard = (props: { children: JSX.Element }) => {
  return (
    <main className="content-drawer">
      <LeaderBoardStyles>
        <MobileLeaderboardDropdwon />
        <LeaderBoardSidebar />
        <div>{props.children}</div>
      </LeaderBoardStyles>
    </main>
  );
};

export function getPageNumber(router: any) {
  const page = router.asPath.split('=')[1];
  return +page;
}

const LeaderBoardOutlet = () => {
  useEffect(() => {
    document.title = 'Buffer | Competitions';
  }, []);
  return <Outlet />;
};

export default LeaderBoardOutlet;
