import LeaderboardTropy from '@Public/LeaderBoard/Trophy';
import { divide, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  activeChainAtom,
  activeTournamentDataReadOnlyAtom,
  allLeaderboardDataAtom,
  leaderboardActivePgaeIdAtom,
  leaderboardPaginationAtom,
} from '@Views/NoLoss-V3/atoms';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';

enum TableColumn {
  Rank = 0,
  User = 1,
  Volume = 2,
  Trades = 3,
  Score = 4,
  NetPnl = 5,
}

export const LeaderboardTable: React.FC<{
  onlyShow?: number[];
  isMobile?: boolean;
}> = ({ onlyShow, isMobile = false }) => {
  const leaderboardData = useAtomValue(allLeaderboardDataAtom);
  const [pages, setPages] = useAtom(leaderboardPaginationAtom);
  const [activePageId, setActivePageId] = useAtom(leaderboardActivePgaeIdAtom);
  const tournament = useAtomValue(activeTournamentDataReadOnlyAtom);
  const activeChain = useAtomValue(activeChainAtom);

  const headNameArray = [
    'Rank',
    'User',
    'Volume',
    'Trades',
    'Score',
    'Net PnL(%)',
  ];

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const filteredData = useMemo(() => {
    if (leaderboardData === undefined) return undefined;
    const data = leaderboardData[activePageId];
    if (data.length === 0) return [];
    return data.filter((item) => parseInt(item.rank) !== 0);
  }, [leaderboardData]);

  const BodyFormatter: any = (row: number, col: number) => {
    if (filteredData === undefined) return 'Loading';
    const userData = filteredData[row];
    const rank = 10 * (pages.activePage - 1) + row + 1;
    if (tournament === undefined || tournament.data === undefined) return <></>;
    const shouldShowTrophy =
      rank <= +tournament.data.tournamentLeaderboard.totalWinners;
    switch (col) {
      case TableColumn.Rank:
        return (
          <div className="pl-[1rem] flex items-center">
            #{rank}{' '}
            {shouldShowTrophy && <LeaderboardTropy className="!scale-50" />}
          </div>
        );
      case TableColumn.User:
        return (
          <div className="flex gap-2">
            {getSlicedUserAddress(userData.stats.user, 4)}
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
      default:
        return 'Unhandle Column';
    }
  };

  return (
    <BufferTable
      bodyJSX={BodyFormatter}
      headerJSX={HeaderFomatter}
      loading={!filteredData}
      rows={filteredData?.length || 0}
      cols={headNameArray.length}
      onRowClick={(row) => {
        if (activeChain !== undefined && filteredData !== undefined) {
          const userData = filteredData[row];
          const address = userData.stats.user;
          const activeChainExplorer = activeChain.blockExplorers?.default?.url;
          if (activeChainExplorer === undefined) return;
          window.open(`${activeChainExplorer}/address/${address}`);
        }
      }}
      widths={['auto']}
      activePage={pages.activePage}
      count={pages.totalPages}
      onPageChange={(e, page) => {
        console.log(e, page, 'e,page');
        if (!filteredData) return;
        // setNextRankId(filteredData[9].stats.next);
        setActivePageId(filteredData[filteredData.length - 1].stats.next);
        setPages(page);
      }}
      error={<TableErrorRow msg="No user found." />}
      shouldOnlyRenderActivePageAndArrows
      shouldShowMobile
      showOnly={onlyShow}
      doubleHeight={isMobile}
    />
  );
};
