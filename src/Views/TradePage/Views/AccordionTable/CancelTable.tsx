import FailureIcon from '@SVG/Elements/FailureIcon';
import { divide } from '@Utils/NumString/stringArithmatics';
import BufferTable from '@Views/Common/BufferTable';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { buyTradeDataAtom } from '@Views/TradePage/Hooks/useBuyTradeData';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { TradeType } from '@Views/TradePage/type';
import { useAtomValue } from 'jotai';
import { useMedia } from 'react-use';
import { getAddress } from 'viem';
import { AssetCell } from './AssetCell';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
} from './Common';

export const CancelledTable: React.FC<{
  trades: TradeType[] | undefined;
  onlyView?: number[];
  activePage?: number;
  setActivePage?: (page: number) => void;
  totalPages?: number;
  platform?: boolean;
  isLoading: boolean;
  className?: string;
  overflow?: boolean;
}> = ({
  trades,
  platform,
  totalPages,
  isLoading,
  onlyView,
  className,
  overflow = true,
  activePage,
  setActivePage,
}) => {
  const { getPoolInfo } = usePoolInfo();
  const isMobile = useMedia('(max-width:600px)');
  const readcallData = useAtomValue(buyTradeDataAtom);

  let strikePriceHeading = 'Strike Price';
  let tradeSizeHeading = 'Trade Size';
  if (isMobile) {
    strikePriceHeading = 'Strike';
    tradeSizeHeading = 'Size';
  }
  const headNameArray = [
    'Asset',
    strikePriceHeading,
    tradeSizeHeading,
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
    if (trades === undefined) return <></>;
    if (!readcallData) return <></>;

    const trade = trades?.[row];
    const poolInfo = getPoolInfo(trade.pool.pool);
    const maxOi = readcallData.maxOIs[getAddress(trade.target_contract)];
    const currentOi =
      readcallData.currentOIs[getAddress(trade.target_contract)];

    switch (col) {
      case TableColumn.Strike:
        return (
          <StrikePriceComponent
            trade={trade}
            currentOI={currentOi}
            maXOI={maxOi}
          />
        );
      case TableColumn.Asset:
        return (
          <AssetCell currentRow={trade} platform={platform} split={isMobile} />
        );

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
          <div>{trade.cancellation_reason || '-'}</div>
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
      showOnly={onlyView}
      overflow={overflow}
      error={<TableErrorRow msg="No active trades present." />}
      loading={isLoading}
      className={className}
    />
  );
};
