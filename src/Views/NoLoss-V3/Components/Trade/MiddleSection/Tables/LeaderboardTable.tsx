import { getSlicedUserAddress } from '@Utils/getUserAddress';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import {
  leaderboardDataAtom,
  leaderboardPaginationAtom,
  nextRankIdAtom,
} from '@Views/NoLoss-V3/atoms';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';

enum TableColumn {
  Rank = 0,
  User = 1,
  Volume = 2,
  Trades = 3,
  Score = 4,
  NetPnl = 5,
}

export const LeaderboardTable = () => {
  const data = useAtomValue(leaderboardDataAtom);
  const setNextRankId = useSetAtom(nextRankIdAtom);
  const [pages, setPages] = useAtom(leaderboardPaginationAtom);

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
    if (data === undefined) return undefined;
    if (data.length === 0) return [];
    return data.filter((item) => parseInt(item.rank) !== 0);
  }, [data]);

  const BodyFormatter: any = (row: number, col: number) => {
    if (filteredData === undefined) return 'Loading';
    const userData = filteredData[row];
    switch (col) {
      case TableColumn.Rank:
        return <div className="pl-[1.6rem]">{parseInt(userData.rank)}</div>;
      case TableColumn.User:
        return getSlicedUserAddress(userData.stats.user, 4);
      case TableColumn.Volume:
        return userData.stats.totalFee;
      case TableColumn.Trades:
        return userData.stats.trades;
      case TableColumn.Score:
        return userData.stats.score;
      case TableColumn.NetPnl:
        return userData.stats.netPnl;
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
      onRowClick={() => {}}
      widths={['auto']}
      activePage={pages.activePage}
      count={pages.totalPages}
      onPageChange={(e, page) => {
        console.log(e, page, 'e,page');
        if (!filteredData) return;
        setNextRankId(filteredData[9].stats.next);
        setPages(page);
      }}
      error={<TableErrorRow msg="No user found." />}
      shouldOnlyRenderActivePageAndArrows
    />
  );
};
