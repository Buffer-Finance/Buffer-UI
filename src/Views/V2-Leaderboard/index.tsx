import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LeaderBoardDrawers } from './drawers';
import { LeaderBoardSidebar, MobileLeaderboardDropdwon } from './Sidebar';
import { LeaderBoardStyles } from './style';
import {
  ArbitrumOnly,
  ChainNotSupported,
} from '@Views/Common/ChainNotSupported';
import { HeadTitle } from '@Views/Common/TitleHead';

export const LeaderBoard = (props: { children: JSX.Element }) => {
  return (
    // <ArbitrumOnly>
    <main className="content-drawer">
      <HeadTitle title={'Buffer | Competitions'} />
      <LeaderBoardStyles>
        {/* <MobileLeaderboardDropdwon /> */}
        <LeaderBoardSidebar />
        {props.children}
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
