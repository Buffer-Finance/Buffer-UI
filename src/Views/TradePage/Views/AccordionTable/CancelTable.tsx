import BufferTable from '@Views/Common/BufferTable';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
} from './Common';
import { TradeType } from '@Views/TradePage/type';
import FailureIcon from '@SVG/Elements/FailureIcon';
import { AssetCell } from './AssetCell';
import { useAtom } from 'jotai';
import { cancelTableActivePage } from '@Views/TradePage/atoms';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';

export const CancelledTable: React.FC<{
  trades: TradeType[];
  totalPages: number;
  platform?: boolean;
}> = ({ trades, platform, totalPages }) => {
  const [activePage, setActivePage] = useAtom(cancelTableActivePage);
  const { getPoolInfo } = usePoolInfo();

  const headNameArray = [
    'Asset',
    'Strike Price',
    'Trade Size',
    'Queue',
    'Cancellation',
    'Reason',
    'Status',
  ];

  enum TableColumn {
    Asset = 0,
    Strike = 1,
    TradeSize = 2,
    QueueTime = 3,
    CancellationTime = 4,
    Reason = 5,
    Status = 6,
  }
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = trades?.[row];
    const poolInfo = getPoolInfo(trade.pool.pool);

    switch (col) {
      case TableColumn.Strike:
        return <StrikePriceComponent trade={trade} />;
      case TableColumn.Asset:
        return <AssetCell currentRow={trade} platform={platform} />;

      case TableColumn.QueueTime:
        return (
          // queuedTradeFallBack(trade) || (
          <DisplayTime ts={trade.open_timestamp} />
          // )
        );
      case TableColumn.CancellationTime:
        return (
          <DisplayTime
            ts={trade.cancellation_timestamp || Math.round(Date.now() / 1000)}
          />
        );
      case TableColumn.Reason:
        return (
          <div>{trade.canellation_reason || 'Some server issue'}</div>
          // queuedTradeFallBack(trade) || (
          // )
        );
      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            className="!justify-start"
            unit={poolInfo.token}
          />
        );
      case TableColumn.Status:
        return (
          <NumberTooltip content={'The trade is cancelled'}>
            <div
              className={`flex  sm:flex-row-reverse items-center justify-between w-max px-2   rounded-[5px] bg-[#282B39]`}
            >
              <span
                className={
                  'text-f12 font-normal web:mr-2 tab:mx-2 text-[#C3C2D4]'
                }
              >
                Cancelled
              </span>
              <FailureIcon width={12} height={12} class />
            </div>
          </NumberTooltip>
        );
    }
    return 'Unhandled Body';
  };

  return (
    <BufferTable
      activePage={activePage}
      count={totalPages}
      onPageChange={(e, page) => {
        setActivePage(page);
      }}
      shouldShowMobile={true}
      headerJSX={HeaderFomatter}
      bodyJSX={BodyFormatter}
      cols={headNameArray.length}
      rows={trades ? trades.length : 0}
      widths={['auto']}
      onRowClick={console.log}
      overflow={400}
      error={<TableErrorRow msg="No active trades present." />}
    />
  );
};
