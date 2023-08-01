import BufferTable from '@Views/Common/BufferTable';
import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  getExpiry,
  queuedTradeFallBack,
} from './Common';
import FailedSuccess from '@SVG/Elements/FailedSuccess';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { TradeType } from '@Views/TradePage/type';
import { Share } from './ShareModal/ShareIcon';
import { getPayout } from './ShareModal/utils';
import {
  expiryPriceCache,
  getPriceCacheId,
} from '@Views/TradePage/Hooks/useBuyTradeActions';
import { AssetCell } from './AssetCell';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  ExpiryPrice = 2,
  OpenTime = 3,
  TimeLeft = 4,
  CloseTime = 5,
  TradeSize = 6,
  Payout = 7,
  Status = 8,
  Share = 9,
}

const HistoryTable: React.FC<{
  trades: TradeType[];
  totalPages: number;
  platform?: boolean;
  activePage: number;
  setActivePage: (page: number) => void;
}> = ({ trades, platform, totalPages, activePage, setActivePage }) => {
  const { getPoolInfo } = usePoolInfo();

  const headNameArray = platform
    ? [
        'Asset',
        'Strike Price',
        'Expiry Price',
        'Open Time',
        'Duration',
        'Close Time',
        'Trade Size',
        'Payout',
        'Status',
      ]
    : [
        'Asset',
        'Strike Price',
        'Expiry Price',
        'Open Time',
        'Duration',
        'Close Time',
        'Trade Size',
        'Payout',
        'Status',
        '',
      ];
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = trades?.[row];
    // console.log(`BodyFormatter-row: `, trade);

    const poolInfo = getPoolInfo(trade.pool.pool);
    let expiryPrice: number | null = trade.expiry_price;
    if (!expiryPrice) {
      const id = getPriceCacheId(trade);
      expiryPrice = expiryPriceCache[id] || 0;
    }
    // if (!trade.market) return 'Problem';
    const { pnl, payout } = getPayout(trade, expiryPrice, poolInfo.decimals);
    // console.log(`aug-payout-actual: `, pnl, payout);
    const status = gt(pnl?.toString(), '0')
      ? {
          tooltip: 'You won this bet!',
          chip: 'Win',
          icon: <SuccessIcon width={14} height={14} />,
          textColor: 'text-green',
        }
      : {
          tooltip: 'You lost this trade!',
          chip: 'Loss',
          icon: <FailedSuccess width={14} height={14} />,
          textColor: 'text-red',
        };
    const minClosingTime = getExpiry(trade);
    switch (col) {
      case TableColumn.Strike:
        return <StrikePriceComponent trade={trade} configData={trade.market} />;
      case TableColumn.Asset:
        return (
          <AssetCell
            configData={trade.market}
            currentRow={trade}
            // platform={platform}
          />
        );
      case TableColumn.ExpiryPrice:
        if (!expiryPrice) return 'Fetching...';
        return (
          <Display className="!justify-start" data={divide(expiryPrice, 8)} />
        );
      case TableColumn.OpenTime:
        return (
          queuedTradeFallBack(trade) || (
            <DisplayTime ts={trade.open_timestamp} />
          )
        );
      case TableColumn.TimeLeft:
        return (
          queuedTradeFallBack(trade, true) || (
            <div className={trade.state == 'OPENED' ? 'text-red' : ''}>
              {formatDistance(Variables(minClosingTime - trade.open_timestamp))}
            </div>
          )
        );
      case TableColumn.CloseTime:
        return (
          queuedTradeFallBack(trade) || <DisplayTime ts={minClosingTime} />
        );
      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            className="!justify-start"
            unit={poolInfo.token}
          />
        );
      case TableColumn.Payout:
        return (
          <div>
            {pnl || payout ? (
              <>
                {' '}
                <Display
                  className="!justify-start"
                  data={divide(payout!, poolInfo.decimals)}
                  unit={poolInfo.token}
                />
                <span className={status.textColor + ' flex '}>
                  Net Pnl :{' '}
                  <Display
                    label={status.chip == 'Win' ? '+' : ''}
                    className="!justify-start"
                    data={pnl}
                    unit={poolInfo.token}
                  />
                </span>
              </>
            ) : (
              'Calculating..'
            )}
          </div>
        );
      case TableColumn.Status:
        return (
          <NumberTooltip content={status.tooltip}>
            <div
              className={`flex ${status.textColor} sm:flex-row-reverse items-center justify-between w-max px-2   rounded-[5px] bg-[#282B39]`}
            >
              <div
                className={
                  'text-f13 font-normal web:mr-2 tab:mx-2' +
                  ` ${status.textColor}`
                }
              >
                {status.chip}
              </div>

              {status.icon}
            </div>
          </NumberTooltip>
        );
      case TableColumn.Share:
        return <Share data={trade} market={trade.market} poolInfo={poolInfo} />;
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
      error={<TableErrorRow msg="No Trade History." />}
    />
  );
};
export { HistoryTable };
