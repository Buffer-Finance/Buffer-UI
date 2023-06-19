import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom } from 'jotai';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { AssetCell } from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  getProbability,
  queuedTradeFallBack,
  tableButtonClasses,
} from './Common';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { useState } from 'react';
import { ShowIcon } from '@SVG/Elements/ShowIcon';
import { OngoingTradeSchema } from '@Views/TradePage/type';
import { visualizeddAtom } from '@Views/TradePage/atoms';

export const tradesCount = 10;

const priceDecimals = 8;

export const OngoingTradesTable: React.FC<{
  trades: OngoingTradeSchema[];
  platform?: boolean;
}> = ({ trades, platform }) => {
  console.log(`OngoingTradesTable-trades: `, trades);
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const markets = useMarketsConfig();
  const [cancelLoading, setCancelLoading] = useState<null | number>(null);
  const headNameArray = platform
    ? [
        'Asset',
        'Strike Price',
        'Current Price',
        'Open Time',
        'Time Left',
        'Close Time',
        'Trade Size',
      ]
    : [
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
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const { cancelHandler } = useCancelTradeFunction();

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = trades?.[row];

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
            show={!isVisualized}
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
        return (
          <AssetCell
            configData={tradeMarket}
            currentRow={trade}
            platform={platform}
          />
        );
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
      rows={trades ? trades.length : 0}
      widths={['auto']}
      onRowClick={console.log}
      overflow={400}
      error={<TableErrorRow msg="No active trades present." />}
    />
  );
};

const UserOngoingTrades = () => {
  const [ongoingData] = useOngoingTrades();
  return <OngoingTradesTable trades={ongoingData} />;
};

export default UserOngoingTrades;
