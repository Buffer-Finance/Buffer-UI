import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom, useAtomValue } from 'jotai';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide, gt, round } from '@Utils/NumString/stringArithmatics';
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
import {
  OngoingTradeSchema,
  marketType,
  poolInfoType,
} from '@Views/TradePage/type';
import { queuets2priceAtom, visualizeddAtom } from '@Views/TradePage/atoms';
import { useEarlyPnl } from '../BuyTrade/ActiveTrades/TradeDataView';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { toFixed } from '@Utils/NumString';

export const tradesCount = 10;

const priceDecimals = 8;

export const OngoingTradesTable: React.FC<{
  trades: OngoingTradeSchema[];
  platform?: boolean;
}> = ({ trades, platform }) => {
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const cachedPrices = useAtomValue(queuets2priceAtom);

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
        'PnL | Probability',
        'Display',
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
  const { cancelHandler, earlyCloseHandler, earlyCloseLoading } =
    useCancelTradeFunction();
  const { getPoolInfo } = usePoolInfo();

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

    const poolContract = tradeMarket?.pools.find(
      (pool) =>
        pool.optionContract.toLowerCase() ===
        trade?.target_contract.toLowerCase()
    )?.pool;
    const poolInfo = getPoolInfo(poolContract);
    const marketPrecision = tradeMarket?.price_precision.toString().length - 1;

    if (!trade || !tradeMarket) return 'Problem';
    let tradeExpiryTime = trade.expiration_time;
    if (!tradeExpiryTime) {
      tradeExpiryTime = trade.queued_timestamp + trade.period;
    }

    let currTradePrice = trade.strike;
    if (trade.state == 'QUEUED') {
      currTradePrice = cachedPrices?.[trade.queue_id];
    }
    const lockedAmmount = cachedPrices?.[tradeMarket.tv_id + trade.trade_size];
    console.log(`OngoingTradesTable-lockedAmmount: `, lockedAmmount);
    switch (col) {
      case TableColumn.Show:
        const isVisualized = visualized.includes(trade.queue_id);
        return !currTradePrice ? (
          <GreyBtn
            className={tableButtonClasses}
            onClick={() => {
              cancelHandler(trade, cancelLoading, setCancelLoading);
            }}
            isLoading={cancelLoading == trade.queue_id}
          >
            Cancel
          </GreyBtn>
        ) : (
          <div className="flex  gap-x-[20px] items-center">
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
            <GreyBtn
              className={tableButtonClasses}
              onClick={() => {
                earlyCloseHandler(trade, tradeMarket);
              }}
              isLoading={earlyCloseLoading?.[trade.queue_id]}
            >
              Close
            </GreyBtn>{' '}
          </div>
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
            data={round(
              getPriceFromKlines(marketPrice, tradeMarket),
              marketPrecision
            )}
            precision={marketPrecision}
          />
        );
      case TableColumn.OpenTime:
        return (
          // queuedTradeFallBack(trade) || (
          <DisplayTime ts={trade.queued_timestamp} />
          // )
        );
      case TableColumn.TimeLeft:
        let currentEpoch = Math.round(new Date().getTime() / 1000);
        return (
          // queuedTradeFallBack(trade, true) || (
          <div>
            {formatDistanceExpanded(
              Variables(+tradeExpiryTime! - currentEpoch)
            )}
          </div>
          // )
        );
      case TableColumn.CloseTime:
        return (
          // queuedTradeFallBack(trade) || (
          <DisplayTime ts={tradeExpiryTime} />
          // )
        );
      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, 6)}
            className="!justify-start"
            unit={'USDC'}
          />
        );
      case TableColumn.Probability:
        const probabiliyt = getProbability(
          trade,
          +getPriceFromKlines(marketPrice, tradeMarket),
          tradeExpiryTime
        );
        return (
          // queuedTradeFallBack(trade) || (
          <div>
            {probabiliyt ? (
              <>
                <Pnl
                  configData={tradeMarket}
                  trade={trade}
                  poolInfo={poolInfo}
                  lockedAmmount={lockedAmmount}
                />
                {toFixed(probabiliyt, 2) + '%'}
              </>
            ) : (
              'Calculating...'
            )}
          </div>
          // )
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
export const Pnl = ({
  trade,
  configData,
  poolInfo,
  lockedAmmount,
}: {
  trade: OngoingTradeSchema;
  configData: marketType;
  poolInfo: poolInfoType;
  lockedAmmount?: string;
}) => {
  const pnl = useEarlyPnl({ trade, configData, poolInfo, lockedAmmount });
  if (trade.state == 'QUEUED')
    console.log(`OngoingTradesTable-pnl: `, trade.state, pnl, lockedAmmount);
  const isWin = gt(pnl.earlycloseAmount, '0');
  if (trade.locked_amount || lockedAmmount)
    return (
      <Display
        data={pnl.earlycloseAmount}
        label={isWin ? '+' : ''}
        className={`!justify-start ${isWin ? 'text-green' : 'text-red'}`}
        unit={poolInfo.token}
      />
    );
  return <div>Calculating..</div>;
};
