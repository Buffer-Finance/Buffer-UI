import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import BufferTable from '@Views/Common/BufferTable';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { priceAtom } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { toFixed } from '@Utils/NumString';
import { divide, gt, round } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { GreyBtn } from '@Views/Common/V2-Button';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { buyTradeDataAtom } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import {
  closeLoadingAtom,
  queuets2priceAtom,
  tradeInspectMobileAtom,
} from '@Views/TradePage/atoms';
import { TradeType, marketType, poolInfoType } from '@Views/TradePage/type';
import { calculateOptionIV } from '@Views/TradePage/utils/calculateOptionIV';
import { getAssetImageUrl } from '@Views/TradePage/utils/getAssetImageUrl';
import { useMedia } from 'react-use';
import { getAddress } from 'viem';
import { useEarlyPnl } from '../BuyTrade/ActiveTrades/TradeDataView';
import { AssetCell } from './AssetCell';
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
import { Visualized } from './Visualized';

export const OngoingTradesTable: React.FC<{
  trades: TradeType[] | undefined;
  platform?: boolean;
  onlyView?: number[];
  activePage?: number;
  setActivePage?: (page: number) => void;
  totalPages?: number;
  isLoading: boolean;
  className?: string;
  overflow: boolean;
}> = ({
  trades,
  platform,
  activePage,
  setActivePage,
  onlyView,
  totalPages,
  isLoading,
  className = '',
  overflow,
}) => {
  const { viewOnlyMode } = useUserAccount();
  const isNotMobile = useMedia('(min-width:1200px)');
  const isMobile = useMedia('(max-width:600px)');

  const [marketPrice] = useAtom(priceAtom);
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { registeredOneCT } = useOneCTWallet();
  const readcallData = useAtomValue(buyTradeDataAtom);
  const setInspectTrade = useSetAtom(tradeInspectMobileAtom);
  let strikePriceHeading = 'Strike Price';
  if (isMobile) {
    strikePriceHeading = 'Strike';
  }
  const headNameArray =
    platform || !registeredOneCT || viewOnlyMode
      ? [
          'Asset',
          strikePriceHeading,
          'Current Price',
          'Open Time',
          'Time Left',
          'Close Time',
          'Trade Size',
          'PnL | Probability',
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
    if (!readcallData) return <></>;
    const trade = trades?.[row];
    if (!trade) return 'Problem';
    const maxOi = readcallData.maxOIs[getAddress(trade.target_contract)];
    const currentOi =
      readcallData.currentOIs[getAddress(trade.target_contract)];

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
        return distanceObject.distance >= 0 ? (
          <div className="flex  gap-x-[20px] items-center">
            <Visualized queue_id={trade.queue_id} />
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
        return (
          <StrikePriceComponent
            trade={trade}
            currentOI={currentOi}
            maXOI={maxOi}
          />
        );
      case TableColumn.Asset:
        return (
          <AssetCell currentRow={trade} platform={false} split={isMobile} />
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
        if (!isNotMobile) {
          return (
            <div className="flex items-center">
              <Display
                data={divide(trade.trade_size, poolInfo.decimals)}
                className="!justify-start"
                // unit={poolInfo.token}
              />{' '}
              <img
                src={getAssetImageUrl(trade.token)}
                width={13}
                height={13}
                className="inline ml-2"
              />
            </div>
          );
        }
        return (
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            className="!justify-start"
            unit={trade.token}
          />
        );
      case TableColumn.Probability:
        const IV =
          calculateOptionIV(
            trade.is_above ?? false,
            trade.strike / 1e8,
            +getPriceFromKlines(marketPrice, trade.market),
            trade.pool.IV,
            trade.pool.IVFactorITM,
            trade.pool.IVFactorOTM
          ) / 1e4;
        const probabiliyt = getProbability(
          trade,
          +getPriceFromKlines(marketPrice, trade.market),
          IV
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

  const Accordian = (row: number) => {
    const trade = trades?.[row];

    if (!trade) return <>Something went wrong.</>;
    const poolInfo = getPoolInfo(trade?.pool?.pool);
    if (!poolInfo) return <>Something went wrong.</>;
    const minClosingTime = getExpiry(trade);

    const headerClass = 'text-[#808191] text-f12';
    const descClass = 'text-[#C3C2D4] text-f2';
    const dateClass = 'text-[#6F6E84] text-f10';
    const durationClass = 'text-[#7F87A7] text-f12';
    const timeClass = 'text-[#C3C2D4] text-f12';
    return (
      <div className="px-3 py-2">
        <RowBetween>
          <div className={timeClass}>
            {getDisplayTime(trade.open_timestamp)}
          </div>
          <div className={durationClass}>
            {formatDistance(Variables(minClosingTime - trade.open_timestamp))}
          </div>
          <div className={timeClass}>{getDisplayTime(minClosingTime)}</div>
        </RowBetween>
        <div className="h-1 w-full bg-[#393D4D] mt-3" />
        <RowBetween className="mt-3">
          <div className={dateClass}>
            {getDisplayDate(trade.open_timestamp)}
          </div>
          <div className={dateClass}>{getDisplayDate(minClosingTime)}</div>
        </RowBetween>
      </div>
    );
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
        // if (isNotMobile) return null;
        // else setInspectTrade({ trade: trades?.[idx] });
      }}
      overflow={overflow}
      error={<TableErrorRow msg="No active trades present." />}
      loading={isLoading}
      className={className}
      accordianJSX={!isNotMobile && platform ? Accordian : undefined}
      doubleHeight={!isNotMobile}
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
