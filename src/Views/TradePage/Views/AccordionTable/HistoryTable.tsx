import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom } from 'jotai';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';
import { useOngoingTrades } from '@Views/TradePage/Hooks/ongoingTrades';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { AssetCell } from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import {
  DisplayTime,
  StrikePriceComponent,
  TableButton,
  TableErrorRow,
  getProbability,
  queuedTradeFallBack,
  tableButtonClasses,
} from './Common';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { useState } from 'react';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import FailedSuccess from '@SVG/Elements/FailedSuccess';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import { Share } from '@Views/BinaryOptions/Tables/TableComponents';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';

export const tradesCount = 10;
export const visualizeddAtom = atom<number[]>([]);
const headNameArray = [
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

const HistoryTable = () => {
  const [marketPrice] = useAtom(priceAtom);
  const [ongoingData] = useHistoryTrades();
  const markets = useMarketsConfig();
  const { getPoolInfo } = usePoolInfo();

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = ongoingData?.[row];
    console.log(`BodyFormatter-row: `, trade);

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
      trade.payout > 0
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
        return <AssetCell configData={tradeMarket} currentRow={trade} />;
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
              data={divide(trade.payout, 6)}
              unit="USDC"
            />
            <span className={status.textColor}>
              Net Pnl :{' '}
              {(status.chip == 'Win' ? '+' : '-') +
                divide(
                  status.chip == 'Win'
                    ? subtract(trade.payout, trade.trade_size)
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
      rows={ongoingData ? ongoingData.length : 0}
      widths={['auto']}
      onRowClick={console.log}
      overflow={400}
      error={<TableErrorRow msg="No trade history present." />}
    />
  );
};

export default HistoryTable;

const ShowIcon = ({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: (a: any) => void;
}) => (
  <svg
    onClick={() => {
      onToggle(!show);
    }}
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    className="hover:brightness-110"
    role="button"
    fill="none"
  >
    <rect
      width={17}
      height={17}
      x={0.266}
      fill={!show ? '#282B39' : ' bg-blue'}
      rx={2}
    />
    <path
      fill="#C3C2D4"
      fillRule="evenodd"
      d="M8.482 4.69a6.287 6.287 0 0 1 3.04.82 7.455 7.455 0 0 1 1.513 1.128c.473.45.866.95 1.229 1.497a.394.394 0 0 1 0 .451 8.384 8.384 0 0 1-1.765 1.98c-.819.644-1.717 1.095-2.725 1.32-.362.081-.74.13-1.118.13a6.134 6.134 0 0 1-2.285-.37 6.733 6.733 0 0 1-1.67-.903 8.24 8.24 0 0 1-1.858-1.932c-.063-.08-.11-.16-.174-.257a.372.372 0 0 1 0-.403c.678-1.062 1.544-1.948 2.615-2.576a6.197 6.197 0 0 1 2.474-.837c.252-.016.488-.032.724-.049Zm-.063 6.585c.347 0 .63-.016.914-.065a5.644 5.644 0 0 0 2.237-.885 7.39 7.39 0 0 0 1.938-1.916c.031-.032.031-.065 0-.097a9.221 9.221 0 0 0-.883-1.062c-.535-.532-1.134-.983-1.827-1.289a5.502 5.502 0 0 0-3.088-.466 5.402 5.402 0 0 0-2.331.901 7.51 7.51 0 0 0-1.953 1.932c-.016.033-.016.049 0 .08.267.387.567.742.897 1.08a6.333 6.333 0 0 0 1.639 1.191c.803.387 1.638.596 2.457.596Z"
      clipRule="evenodd"
    />
    <path
      fill="#C3C2D4"
      fillRule="evenodd"
      d="M8.668 10.21a1.951 1.951 0 0 1-1.954-1.97 1.98 1.98 0 0 1 1.923-1.938c1.1-.015 2 .885 1.985 1.984a1.961 1.961 0 0 1-1.954 1.924ZM9.92 8.256c0-.687-.565-1.252-1.252-1.252-.718 0-1.267.595-1.267 1.267a1.26 1.26 0 0 0 2.519-.015Z"
      clipRule="evenodd"
    />
    <circle cx={8.668} cy={8.256} r={1.466} fill="#C3C2D4" />
  </svg>
);
