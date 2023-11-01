import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateHistoryPageNumber,
} from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  Expiry = 2,
  OpenTime = 3,
  Duration = 4,
  TradeSize = 5,
  Payout = 6,
}

export const HistoryTable = () => {
  const { history } = useAtomValue(tardesAtom);
  const { history: totalPages } = useAtomValue(tardesTotalPageAtom);
  const { history: activePage } = useAtomValue(tardesPageAtom);
  const setHistoryPage = useSetAtom(updateHistoryPageNumber);

  const headNameArray = [
    'Asset',
    'Strike',
    'Expiry',
    'Open Time',
    'Duration',
    'Trade Size',
    'Payout',
  ];

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = history[row];
    switch (col) {
      case TableColumn.Asset:
      // return (
      //   <AssetCell
      //     currentRow={trade}
      //     split={isMobile}
      //   />
      // );
    }
  };

  <BufferTable
    bodyJSX={BodyFormatter}
    headerJSX={HeaderFomatter}
    loading={history.length === 0}
    rows={history.length}
    cols={headNameArray.length}
    onRowClick={() => {}}
    widths={['auto']}
    activePage={activePage}
    count={totalPages}
    onPageChange={(e, page) => {
      setHistoryPage(page);
    }}
    error={<TableErrorRow msg="No trades found." />}
    shouldOnlyRenderActivePageAndArrows
  />;
};
