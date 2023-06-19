import BufferTable from '@Views/Common/BufferTable';
import { atom, useAtom } from 'jotai';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { priceAtom } from '@Hooks/usePrice';

import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { AssetCell } from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  queuedTradeFallBack,
} from './Common';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import FailedSuccess from '@SVG/Elements/FailedSuccess';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import { Share } from '@Views/BinaryOptions/Tables/TableComponents';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { OngoingTradeSchema } from '@Views/TradePage/type';

export const tradesCount = 10;

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
const priceDecimals = 8;

const HistoryTable: React.FC<{
  trades: OngoingTradeSchema[];
  platform?: boolean;
}> = ({ trades, platform }) => {
  const [marketPrice] = useAtom(priceAtom);
  const markets = useMarketsConfig();
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

    const tradeMarket = markets?.find((pair) => {
      const pool = pair.pools.find(
        (pool) =>
          pool.optionContract.toLowerCase() ===
          trade?.target_contract.toLowerCase()
      );
      return !!pool;
    });
    const poolContract = tradeMarket?.pools.find(
      (pool) =>
        pool.optionContract.toLowerCase() ===
        trade?.target_contract.toLowerCase()
    )?.pool;
    const poolInfo = getPoolInfo(poolContract);

    if (!tradeMarket) return 'Problem';
    const status =
      trade.payout && trade.payout > 0
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
    const minClosingTime = Math.min(trade.expiration_time!, trade.close_time);
    switch (col) {
      case TableColumn.Strike:
        return <StrikePriceComponent trade={trade} configData={tradeMarket} />;
      case TableColumn.Asset:
        return (
          <AssetCell
            configData={tradeMarket}
            currentRow={trade}
            // platform={platform}
          />
        );
      case TableColumn.ExpiryPrice:
        return (
          <Display
            className="!justify-start"
            data={getPriceFromKlines(marketPrice, tradeMarket)}
          />
        );
      case TableColumn.OpenTime:
        return (
          queuedTradeFallBack(trade) || (
            <DisplayTime ts={trade.queued_timestamp} />
          )
        );
      case TableColumn.TimeLeft:
        let currentEpoch = Math.round(new Date().getTime() / 1000);
        return (
          queuedTradeFallBack(trade, true) || (
            <div>
              {formatDistanceExpanded(
                Variables(minClosingTime - trade.queued_timestamp)
              )}
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
            data={divide(trade.trade_size, 6)}
            className="!justify-start"
            unit={tradeMarket?.token1}
          />
        );
      case TableColumn.Payout:
        return (
          <div>
            <Display
              className="!justify-start"
              data={divide(trade.payout!, 6)}
              unit="USDC"
            />
            <span className={status.textColor}>
              Net Pnl :{' '}
              {(status.chip == 'Win' ? '+' : '-') +
                divide(
                  status.chip == 'Win'
                    ? subtract(trade.payout! + '', trade.trade_size + '')
                    : trade.trade_size,
                  6
                )}{' '}
            </span>
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
        return <Share data={trade} market={tradeMarket} poolInfo={poolInfo} />;
    }
    return 'Unhandled Body';
  };

  return (
    <BufferTable
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

const UserHistory = () => {
  const [ongoingData] = useHistoryTrades();
  // console.log(`HistoryTable-ongoingData: `, ongoingData);
  return <HistoryTable trades={ongoingData} />;
};
export default UserHistory;
