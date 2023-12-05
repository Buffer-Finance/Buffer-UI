import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { toFixed } from '@Utils/NumString';
import { divide, lt, subtract } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { numberWithCommas } from '@Utils/display';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { openBlockExplorer } from '@Views/AboveBelow/Helpers/openBlockExplorer';
import { BetState } from '@Views/AboveBelow/Hooks/useAheadTrades';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { AssetCell } from './Components/AssetCell';
import { PayoutChip } from './Components/PayoutChip';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  Expiry = 2,
  OpenTime = 3,
  Duration = 4,
  CloseTime = 5,
  TradeSize = 6,
  Payout = 7,
  User = 8,
}

export const History: React.FC<{
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
  totalPages: number;
  activePage: number;
  history: IGQLHistory[];
  inGlobalContext?: boolean;
  setHistoryPage: (page: number) => void;
  isLoading: boolean;
  error?: React.ReactNode;
}> = ({
  onlyView,
  overflow,
  isMobile,
  activePage,
  history,
  setHistoryPage,
  totalPages,
  inGlobalContext = false,
  isLoading,
  error,
}) => {
  const { activeChain } = useActiveChain();

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

  if (inGlobalContext) {
    headNameArray.push('user');
  }

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = history[row];
    const decimals = trade.market.poolInfo.decimals;
    switch (col) {
      case TableColumn.Asset:
        return (
          <div>
            <AssetCell currentRow={trade} split={isMobile} />
          </div>
        );
      case TableColumn.Strike:
        return (
          <Display
            data={divide(trade.strike, 8)}
            precision={trade.market.price_precision.toString().length - 1}
            className="!justify-start"
          />
        );
      case TableColumn.Expiry:
        if (trade.state === BetState.active) return <>processing...</>;
        return (
          <Display
            data={divide(trade.expirationPrice ?? '0', 8)}
            precision={trade.market.price_precision.toString().length - 1}
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
        return (
          <Display
            data={divide(trade.amount, decimals)}
            precision={2}
            unit={trade.market.poolInfo.token}
            className="!justify-start"
          />
        );
      case TableColumn.Payout:
        if (trade.state === BetState.active) return <PayoutChip data={trade} />;
        const pnl = subtract(trade.payout ?? '0', trade.amount);
        const isTradeLost = lt(pnl, '0');

        if (isMobile)
          return (
            <div
              className={`flex items-center ${isTradeLost ? 'red' : 'green'}`}
            >
              {isTradeLost ? '' : '+ '}
              <Display
                data={divide(pnl, trade.market.poolInfo.decimals)}
                precision={2}
              />
            </div>
          );
        return (
          <div className="flex flex-col gap-1">
            <Display
              data={divide(trade.payout ?? '0', trade.market.poolInfo.decimals)}
              precision={2}
              className="!justify-start"
            />
            <div
              className={`flex items-center ${isTradeLost ? 'red' : 'green'}`}
            >
              Net Pnl : {isTradeLost ? '' : '+ '}
              <Display
                data={divide(pnl, trade.market.poolInfo.decimals)}
                precision={2}
              />
            </div>
          </div>
        );
      case TableColumn.User:
        return (
          <button
            onClick={() => openBlockExplorer(trade.user, activeChain)}
            className="flex items-center gap-2"
          >
            {getSlicedUserAddress(trade.user, 4)}
            <Launch />
          </button>
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
                      trade.market.price_precision.toString().length - 1
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
                    toFixed(
                      divide(
                        trade.payout as string,
                        trade.market.poolInfo.decimals
                      ) as string,
                      2
                    )
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
      loading={isLoading}
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
      error={error}
    />
  );
};
