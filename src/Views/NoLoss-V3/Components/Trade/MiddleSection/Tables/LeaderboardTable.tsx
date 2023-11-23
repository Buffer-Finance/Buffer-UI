import LeaderboardTropy from '@Public/LeaderBoard/Trophy';
import { createArray } from '@Utils/JSUtils/createArray';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import BufferTable, {
  BufferTableCell,
  BufferTableRow,
} from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  activeChainAtom,
  activeTournamentDataReadOnlyAtom,
  allLeaderboardDataAtom,
  leaderboardActivePgaeIdAtom,
  leaderboardPaginationAtom,
  userAtom,
} from '@Views/NoLoss-V3/atoms';
import { LeaderboardData } from '@Views/NoLoss-V3/types';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Chain } from 'viem';
import { Reward } from './Reward';

enum TableColumn {
  Rank = 0,
  User = 1,
  Volume = 2,
  Trades = 3,
  Score = 4,
  NetPnl = 5,
  Rewards = 6,
}
export function openBlockExplorer(
  address: string,
  activeChain: Chain | undefined
) {
  if (activeChain !== undefined) {
    const activeChainExplorer = activeChain.blockExplorers?.default?.url;
    if (activeChainExplorer === undefined) return;
    window.open(`${activeChainExplorer}/address/${address}`);
  }
}
export const LeaderboardTable: React.FC<{
  onlyShow?: number[];
  isMobile?: boolean;
  isTournamentClosed: boolean;
}> = ({ onlyShow, isMobile = false, isTournamentClosed }) => {
  const leaderboardData = useAtomValue(allLeaderboardDataAtom);
  const [pages, setPages] = useAtom(leaderboardPaginationAtom);
  const [activePageId, setActivePageId] = useAtom(leaderboardActivePgaeIdAtom);
  const tournament = useAtomValue(activeTournamentDataReadOnlyAtom);
  const activeChain = useAtomValue(activeChainAtom);
  const user = useAtomValue(userAtom);

  const headNameArray = [
    'Rank',
    'User',
    'Volume',
    'Trades',
    'Score',
    'Net PnL(%)',
    isTournamentClosed && 'Rewards',
  ].filter((item) => item !== false) as string[];

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const filteredData = useMemo(() => {
    if (leaderboardData === undefined) return undefined;
    const data = leaderboardData[activePageId];
    if (data.length === 0) return [];
    return data.filter((item) => parseInt(item.rank) !== 0);
  }, [leaderboardData, activePageId]);

  const userData = useMemo(() => {
    if (leaderboardData === undefined) return undefined;
    const data = Object.values(leaderboardData).flat();
    if (data.length === 0) undefined;
    let userRank = 0;
    const userLeaderboardData = data.find((item) => {
      if (item.stats.user === user?.userAddress) {
        return true;
      }
      userRank++;
      return false;
    });
    return { data: userLeaderboardData, rank: userRank };
  }, [user, leaderboardData]);

  const BodyFormatter: any = (
    row: number,
    col: number,
    data: (LeaderboardData & { rank: number }) | undefined
  ) => {
    if (filteredData === undefined) return 'Loading';
    let userData = filteredData[row];
    let rank = 10 * (pages.activePage - 1) + row + 1;
    if (data) {
      userData = data;
      rank = data.rank + 1;
    }
    const isUser = userData.stats.user === user?.userAddress;
    if (tournament === undefined || tournament.data === undefined) return <></>;
    const shouldShowTrophy =
      rank <= +tournament.data.tournamentLeaderboard.totalWinners;

    switch (col) {
      case TableColumn.Rank:
        return (
          <div className=" flex items-center">
            {shouldShowTrophy && <LeaderboardTropy className="!scale-50" />}
            <div className={`${shouldShowTrophy ? '' : 'pl-6'}`}> #{rank}</div>
          </div>
        );
      case TableColumn.User:
        return (
          <div className="flex gap-2 whitespace-nowrap">
            {isUser
              ? 'Your Account'
              : getSlicedUserAddress(userData.stats.user, 4)}
            <Launch className="invisible b1200:visible group-hover:visible mt-[1px]" />
          </div>
        );
      case TableColumn.Volume:
        return (
          <Display
            data={divide(userData.stats.totalFee, 18)}
            precision={2}
            className="!justify-start"
          />
        );
      case TableColumn.Trades:
        return (
          <Display
            data={parseInt(userData.stats.trades)}
            precision={0}
            className="!justify-start"
            disable
          />
        );
      case TableColumn.Score:
        return (
          <Display
            data={parseInt(userData.stats.score) / 1e5}
            className="!justify-start"
            precision={5}
            disable
          />
        );
      case TableColumn.NetPnl:
        const percentageNetPnl = divide(
          userData.stats.netPnl,
          userData.stats.totalFee
        ) as string;
        const isNegative = lt(percentageNetPnl, '0');
        return (
          <div className={`flex items-center ${isNegative ? 'red' : 'green'}`}>
            {!isNegative && '+ '}
            <Display
              data={multiply(percentageNetPnl, 2)}
              precision={2}
              className={`!whitespace-nowrap !justify-start `}
              unit="%"
            />
          </div>
        );
      case TableColumn.Rewards:
        return (
          <Reward tournament={tournament.data} rank={rank} isUser={isUser} />
        );
      default:
        return 'Unhandle Column';
    }
  };

  const UserData = userData &&
    userData.data !== undefined &&
    userData.rank !== (pages.activePage - 1) * 10 && (
      <BufferTableRow onClick={() => {}} className="">
        {isMobile && onlyShow
          ? onlyShow.map((index) => (
              <TopDecoratorCell
                BodyFormatter={BodyFormatter}
                activeChain={activeChain}
                index={index}
                userData={userData}
                isMobile={isMobile}
              />
            ))
          : createArray(headNameArray.length).map((_, i) => (
              <TopDecoratorCell
                BodyFormatter={BodyFormatter}
                activeChain={activeChain}
                index={i}
                userData={userData}
                isMobile={isMobile}
              />
            ))}
      </BufferTableRow>
    );

  const highlightedRows = useMemo(() => {
    const activePage = pages.activePage;
    if (userData === undefined) return [];
    if (userData.data === undefined) return [];
    const isUserOnActivePage =
      userData.rank >= (activePage - 1) * 10 && userData.rank < activePage * 10;
    if (isUserOnActivePage) {
      return [userData.rank % 10];
    }
    return [];
  }, [userData, pages.activePage]);

  return (
    <BufferTable
      topDecorator={UserData}
      bodyJSX={BodyFormatter}
      headerJSX={HeaderFomatter}
      loading={!filteredData}
      rows={filteredData?.length || 0}
      cols={headNameArray.length}
      onRowClick={(row) => {
        if (filteredData !== undefined) {
          const userData = filteredData[row];
          const address = userData.stats.user;
          openBlockExplorer(address, activeChain);
        }
      }}
      widths={['auto']}
      activePage={pages.activePage}
      count={pages.totalPages}
      onPageChange={(e, page) => {
        console.log(e, page, 'e,page');
        if (!filteredData) return;
        setActivePageId(filteredData[filteredData.length - 1].stats.next);
        setPages(page);
      }}
      error={<TableErrorRow msg="No user found." />}
      // shouldOnlyRenderActivePageAndArrows
      shouldShowMobile
      showOnly={onlyShow}
      doubleHeight={isMobile}
      overflow={false}
      highlightedRows={highlightedRows}
    />
  );
};

const TopDecoratorCell: React.FC<{
  userData: {
    data: LeaderboardData | undefined;
    rank: number;
  };
  activeChain: Chain | undefined;
  BodyFormatter: any;
  index: number;
  isMobile: boolean;
}> = ({ userData, activeChain, BodyFormatter, index, isMobile }) => {
  return (
    <BufferTableCell
      className={`highlight ${isMobile ? 'double-height' : ''}`}
      onClick={() => {
        if (userData.data) {
          const address = userData.data.stats.user;
          openBlockExplorer(address, activeChain);
        }
      }}
    >
      {BodyFormatter(0, index, {
        ...userData.data,
        rank: userData.rank,
      })}
    </BufferTableCell>
  );
};
