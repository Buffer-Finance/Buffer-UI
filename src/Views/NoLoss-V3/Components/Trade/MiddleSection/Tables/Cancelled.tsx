import { divide } from '@Utils/NumString/stringArithmatics';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateCancelledPageNumber,
} from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { AssetCell } from '@Views/TradePage/Views/AccordionTable/AssetCell';
import {
  DisplayTime,
  TableErrorRow,
} from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  TradeSize = 2,
  QueueTimestamp = 3,
  CancelTimestamp = 4,
  Reason = 5,
}

export const CancelledTable = () => {
  const { cancelled } = useAtomValue(tardesAtom);
  const { cancelled: totalPages } = useAtomValue(tardesTotalPageAtom);
  const { cancelled: activePage } = useAtomValue(tardesPageAtom);
  const setCancelledPage = useSetAtom(updateCancelledPageNumber);

  const headNameArray = [
    'Asset',
    'Strike',
    'Trade Size',
    'Queue Timestamp',
    'Cancel Timestamp',
    'Reason',
  ];

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = cancelled[row];
    switch (col) {
      case TableColumn.Asset:
        return (
          <div className="pl-[1.6rem]">
            <AssetCell currentRow={trade} split={false} />
          </div>
        );
      case TableColumn.Strike:
        return (
          <Display
            data={divide(trade.strike, 8)}
            precision={trade.chartData.price_precision.toString().length - 1}
            className="!justify-start"
          />
        );
      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.totalFee, 18)}
            precision={2}
            className="!justify-start"
          />
        );
      case TableColumn.QueueTimestamp:
        return <DisplayTime ts={trade.queueTimestamp as string} />;
      case TableColumn.CancelTimestamp:
        return <DisplayTime ts={trade.cancelTimestamp as string} />;
      case TableColumn.Reason:
        return trade.reason;
      default:
        return <></>;
    }
  };

  return (
    <BufferTable
      bodyJSX={BodyFormatter}
      headerJSX={HeaderFomatter}
      loading={cancelled.length === 0}
      rows={cancelled.length}
      cols={headNameArray.length}
      onRowClick={() => {}}
      widths={['auto']}
      activePage={activePage}
      count={totalPages}
      onPageChange={(e, page) => {
        setCancelledPage(page);
      }}
      error={<TableErrorRow msg="No trades found." />}
      shouldOnlyRenderActivePageAndArrows
    />
  );
};
