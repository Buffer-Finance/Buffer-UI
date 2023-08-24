import BufferTable from '@Views/Common/BufferTable';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { formatDistance } from '@Hooks/Utilities/useStopWatch';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide, gt, round } from '@Utils/NumString/stringArithmatics';
import { priceAtom } from '@Hooks/usePrice';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  getEarlyCloseStatus,
  getExpiry,
  getLockedAmount,
  getProbability,
  tableButtonClasses,
} from './Common';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { ShowIcon } from '@SVG/Elements/ShowIcon';
import { TradeType, marketType, poolInfoType } from '@Views/TradePage/type';
import {
  closeLoadingAtom,
  queuets2priceAtom,
  tradeInspectMobileAtom,
  visualizeddAtom,
} from '@Views/TradePage/atoms';
import { useEarlyPnl } from '../BuyTrade/ActiveTrades/TradeDataView';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { toFixed } from '@Utils/NumString';
import { AssetCell } from './AssetCell';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useMedia } from 'react-use';

export const OngoingTradesTable: React.FC<{
  trades: TradeType[] | undefined;
  platform?: boolean;
  onlyView?: number[];
  activePage?: number;
  setActivePage?: (page: number) => void;
  totalPages?: number;
  isLoading: boolean;
}> = ({
  trades,
  platform,
  activePage,
  setActivePage,
  onlyView,
  totalPages,
  isLoading,
}) => {
  const isNotMobile = useMedia('(min-width:1200px)');
  const isMobile = useMedia('(max-width:600px)');

  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { registeredOneCT } = useOneCTWallet();
  const setInspectTrade = useSetAtom(tradeInspectMobileAtom);
  let strikePriceHeading = 'Strike Price';
  if (isMobile) {
    strikePriceHeading = 'Strike';
  }
  const headNameArray =
    platform || !registeredOneCT
      ? [
          'Asset',
          strikePriceHeading,
          'Current Price',
          'Open Time',
          'Time Left',
          'Close Time',
          'Trade Size',
        ]
      : [
          'Asset',
          strikePriceHeading,
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
  const { earlyCloseHandler } = useCancelTradeFunction();
  const earlyCloseLoading = useAtomValue(closeLoadingAtom);
  const { getPoolInfo } = usePoolInfo();

  const BodyFormatter: any = (row: number, col: number) => {
    if (trades === undefined) return <></>;
    const trade = trades?.[row];
    if (!trade) return 'Problem';

    const poolInfo = getPoolInfo(trade.pool.pool);
    const marketPrecision = trade.market.price_precision.toString().length - 1;

    let tradeExpiryTime = getExpiry(trade);

    // let currTradePrice = trade.strike;
    // if (trade.state == 'QUEUED') {
    //   currTradePrice = cachedPrices?.[trade.queue_id];
    // }
    const lockedAmmount = getLockedAmount(trade, cachedPrices);
    const distanceObject = Variables(
      trade.open_timestamp +
        trade.period -
        (trade.close_time || Math.round(Date.now() / 1000))
    );

    const [isDisabled, disableTooltip] = getEarlyCloseStatus(trade);
    switch (col) {
      case TableColumn.Show:
        const isVisualized = visualized.includes(trade.queue_id);
        return distanceObject.distance >= 0 ? (
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
            <NumberTooltip content={disableTooltip}>
              <div>
                <GreyBtn
                  className={
                    tableButtonClasses +
                    (isDisabled ? ' !text-2 !cursor-not-allowed' : '')
                  }
                  onClick={() => {
                    !isDisabled && earlyCloseHandler(trade, trade.market);
                  }}
                  isLoading={earlyCloseLoading?.[trade.queue_id] == 2}
                >
                  Close
                </GreyBtn>
              </div>
            </NumberTooltip>
          </div>
        ) : (
          'Processing...'
        );
      case TableColumn.Strike:
        return <StrikePriceComponent trade={trade} />;
      case TableColumn.Asset:
        return (
          <AssetCell currentRow={trade} platform={platform} split={isMobile} />
        );
      case TableColumn.CurrentPrice:
        return (
          <Display
            className="!justify-start"
            data={round(
              getPriceFromKlines(marketPrice, trade.market),
              marketPrecision
            )}
            precision={marketPrecision}
          />
        );
      case TableColumn.OpenTime:
        return (
          // queuedTradeFallBack(trade) || (
          <DisplayTime ts={trade.open_timestamp} />
          // )
        );
      case TableColumn.TimeLeft:
        let currentEpoch = Math.round(new Date().getTime() / 1000);
        return (
          // queuedTradeFallBack(trade, true) || (
          <div>
            {distanceObject.distance >= 0
              ? formatDistance(distanceObject)
              : '00m:00s'}
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
            data={divide(trade.trade_size, poolInfo.decimals)}
            className="!justify-start"
            unit={trade.token}
          />
        );
      case TableColumn.Probability:
        const probabiliyt = getProbability(
          trade,
          +getPriceFromKlines(marketPrice, trade.market),
          trade.pool.IV
        );
        return (
          // queuedTradeFallBack(trade) || (
          <div>
            {probabiliyt ? (
              <>
                <Pnl
                  configData={trade.market}
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
      activePage={activePage ?? 1}
      count={totalPages ?? 0}
      onPageChange={(e, page) => {
        if (setActivePage === undefined)
          return () => {
            console.log(page);
          };
        setActivePage(page);
      }}
      shouldShowMobile={true}
      headerJSX={HeaderFomatter}
      bodyJSX={BodyFormatter}
      cols={headNameArray.length}
      showOnly={onlyView}
      rows={trades ? trades.length : 0}
      widths={['auto']}
      onRowClick={(idx) => {
        if (isNotMobile) return null;
        else setInspectTrade({ trade: trades?.[idx] });
      }}
      overflow
      error={<TableErrorRow msg="No active trades present." />}
      loading={isLoading}
    />
  );
};

export const Pnl = ({
  trade,
  configData,
  poolInfo,
  lockedAmmount,
}: {
  trade: TradeType;
  configData: marketType;
  poolInfo: poolInfoType;
  lockedAmmount?: string;
}) => {
  const pnl = useEarlyPnl({ trade, configData, poolInfo, lockedAmmount });
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
