import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom } from 'jotai';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide } from '@Utils/NumString/stringArithmatics';
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

export const tradesCount = 10;
export const visualizeddAtom = atom<number[]>([]);
const headNameArray = [
  'Asset',
  'Strike Price',
  'Current Price',
  'Open Time',
  'Time Left',
  'Close Time',
  'Trade Size',
  'Probability',
  'Show',
];

enum TableColumn {
  Asset = 0,
  Strike = 1,
  CurrentPrice = 2,
  OpenTime = 3,
  TimeLeft = 4,
  CloseTime = 5,
  TradeSize = 6,
  Probability = 7,
  Show = 8,
}
const priceDecimals = 8;

const OngoingTradesTable = () => {
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const [ongoingData] = useOngoingTrades();
  console.log(`OngoingTradesTable-ongoingData: `, ongoingData?.length);
  const markets = useMarketsConfig();
  const [cancelLoading, setCancelLoading] = useState<null | number>(null);

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const { cancelHandler } = useCancelTradeFunction();

  const BodyFormatter: any = (row: number, col: number) => {
    console.log(`OngoingTradesTable-row: `, row);
    const trade = ongoingData?.[row];

    const tradeMarket = markets?.find((pair) => {
      const pool = pair.pools.find(
        (pool) =>
          pool.optionContract.toLowerCase() ===
          trade?.target_contract.toLowerCase()
      );
      return !!pool;
    });
    if (!trade || !tradeMarket) return 'Problem';
    switch (col) {
      case TableColumn.Show:
        const isVisualized = visualized.includes(trade.queue_id);
        return queuedTradeFallBack(trade, false, true) ? (
          <GreyBtn
            className={tableButtonClasses}
            onClick={() => {
              cancelHandler(trade.queue_id, cancelLoading, setCancelLoading);
            }}
            isLoading={cancelLoading == trade.queue_id}
          >
            Cancel
          </GreyBtn>
        ) : (
          <ShowIcon
            show={isVisualized}
            onToggle={() => {
              if (isVisualized) {
                let temp = [...visualized];
                temp.splice(visualized.indexOf(trade.queue_id as any), 1);
                setVisualized(temp);
              } else {
                setVisualized([...visualized, trade.queue_id]);
              }
            }}
          />
        );
      case TableColumn.Strike:
        return <StrikePriceComponent trade={trade} configData={tradeMarket} />;
      case TableColumn.Asset:
        return <AssetCell configData={tradeMarket} currentRow={trade} />;
      case TableColumn.CurrentPrice:
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
                Variables(+trade.expiration_time! - currentEpoch)
              )}
            </div>
          )
        );
      case TableColumn.CloseTime:
        return (
          queuedTradeFallBack(trade) || (
            <DisplayTime ts={trade.expiration_time!} />
          )
        );
      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, 6)}
            className="!justify-start"
            unit={tradeMarket?.token1}
          />
        );
      case TableColumn.Probability:
        const probabiliyt = getProbability(
          trade,
          +getPriceFromKlines(marketPrice, tradeMarket)
        );
        return (
          queuedTradeFallBack(trade) || (
            <div>
              {probabiliyt ? (
                <Display data={probabiliyt} precision={2} />
              ) : (
                'Calculating...'
              )}
            </div>
          )
        );
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
      error={<TableErrorRow msg="No active trades present." />}
    />
  );
};

export default OngoingTradesTable;

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
