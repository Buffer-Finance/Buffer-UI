import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { toFixed } from '@Utils/NumString';
import { divide, lt, subtract } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { numberWithCommas } from '@Utils/display';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { BetState } from '@Views/NoLoss-V3/Hooks/useAheadTrades';
import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateHistoryPageNumber,
} from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { getTradeTableError } from '@Views/NoLoss-V3/helpers/getTradeTableError';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { AssetCell } from '@Views/TradePage/Views/AccordionTable/AssetCell';
import {
  DisplayTime,
  TableErrorRow,
} from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';
import { PayoutChip } from './PayoutChip';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  Expiry = 2,
  OpenTime = 3,
  Duration = 4,
  CloseTime = 5,
  TradeSize = 6,
  Payout = 7,
}

export const HistoryTable: React.FC<{
  userAddress: string | undefined;
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
}> = ({ userAddress, onlyView, overflow, isMobile }) => {
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
    'Close Time',
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
        return (
          <div className={`${isMobile ? '' : 'pl-[1.6rem]'}`}>
            <AssetCell currentRow={trade} split={isMobile} />
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
      case TableColumn.Expiry:
        if (trade.state === BetState.active) return <>processing...</>;
        return (
          <Display
            data={divide(trade.expirationPrice ?? '0', 8)}
            precision={trade.chartData.price_precision.toString().length - 1}
            className="!justify-start"
          />
        );
      case TableColumn.OpenTime:
        return <DisplayTime ts={trade.creationTime as string} />;
      case TableColumn.Duration:
        return formatDistance(
          Variables(
            +subtract(
              trade.expirationTime as string,
              trade.creationTime as string
            )
          )
        );
      case TableColumn.CloseTime:
        return <DisplayTime ts={trade.expirationTime as string} />;
      case TableColumn.TradeSize:
        return divide(trade.totalFee, 18);
      case TableColumn.Payout:
        if (trade.state === BetState.active) return <PayoutChip data={trade} />;
        const pnl = subtract(trade.payout ?? '0', trade.totalFee);
        const isTradeLost = lt(pnl, '0');

        if (isMobile)
          return (
            <div
              className={`flex items-center ${isTradeLost ? 'red' : 'green'}`}
            >
              {isTradeLost ? '' : '+ '}
              <Display data={divide(pnl, 18)} precision={2} />
            </div>
          );
        return (
          <div className="flex flex-col gap-1">
            <Display
              data={divide(trade.payout ?? '0', 18)}
              precision={2}
              className="!justify-start"
            />
            <div
              className={`flex items-center ${isTradeLost ? 'red' : 'green'}`}
            >
              Net Pnl : {isTradeLost ? '' : '+ '}
              <Display data={divide(pnl, 18)} precision={2} />
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  const Accordian = (row: number) => {
    if (!isMobile) return <></>;
    const trade = history[row];
    let expiryPrice: string = trade.expirationPrice ?? '0';
    const headerClass = 'text-[#808191] text-f12';
    const descClass = 'text-[#C3C2D4] text-f2';
    const dateClass = 'text-[#6F6E84] text-f10';
    const durationClass = 'text-[#7F87A7] text-f12';
    const timeClass = 'text-[#C3C2D4] text-f12';
    return (
      <div className="px-3 py-2">
        <RowBetween>
          <div className={timeClass}>{getDisplayTime(trade.creationTime)}</div>
          <div className={durationClass}>
            {formatDistance(
              Variables(
                +subtract(
                  trade.expirationTime as string,
                  trade.creationTime as string
                )
              )
            )}
          </div>
          <div className={timeClass}>
            {getDisplayTime(trade.expirationTime)}
          </div>
        </RowBetween>
        {/* <TradeTimeElapsed trade={trade} stopTime={minClosingTime} /> */}
        <RowBetween className="mt-3">
          <div className={dateClass}>
            {getDisplayDate(+(trade.creationTime as string))}
          </div>
          <div className={dateClass}>
            {getDisplayDate(+(trade.expirationTime as string))}
          </div>
        </RowBetween>

        <RowBetween className="mt-5">
          <div>
            <span className={headerClass + ' mr-3'}>Expiry</span>
            <span className={descClass}>
              {expiryPrice
                ? numberWithCommas(
                    toFixed(
                      divide(expiryPrice, 8) as string,
                      trade.chartData.price_precision.toString().length - 1
                    )
                  )
                : 'Processing...'}
            </span>
          </div>
          <div className="flex items-center">
            <span className={headerClass + ' mr-3'}>Payout</span>
            <span className={descClass}>
              {expiryPrice
                ? numberWithCommas(
                    toFixed(divide(trade.payout as string, 18) as string, 2)
                  )
                : 'Calculating...'}
            </span>
          </div>
        </RowBetween>
      </div>
    );
  };

  return (
    <BufferTable
      bodyJSX={BodyFormatter}
      headerJSX={HeaderFomatter}
      loading={userAddress !== undefined && history === undefined}
      rows={history?.length ?? 0}
      cols={headNameArray.length}
      onRowClick={() => {}}
      widths={['auto']}
      activePage={activePage}
      count={totalPages}
      overflow={overflow}
      showOnly={onlyView}
      shouldShowMobile
      doubleHeight={isMobile}
      accordianJSX={!isMobile ? undefined : Accordian}
      onPageChange={(e, page) => {
        setHistoryPage(page);
      }}
      error={<TableErrorRow msg={getTradeTableError(userAddress)} />}
    />
  );
};
