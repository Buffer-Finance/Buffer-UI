import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getCachedPriceFromKlines } from '@TV/useDataFeed';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { divide, round } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { Price } from '@Views/AboveBelow/Components/Tables/Components/Price';
import { useMarketPrice } from '@Views/AboveBelow/Hooks/useMarketPrice';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { Display } from '@Views/Common/Tooltips/Display';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { queuets2priceAtom } from '@Views/TradePage/atoms';
import { TradeType } from '@Views/TradePage/type';
import {
  getAssetImageUrl,
  getAssetMonochromeImageUrl,
} from '@Views/TradePage/utils/getAssetImageUrl';
import { useAtomValue } from 'jotai';
import { useMedia } from 'react-use';
import { TradeTimeElapsed } from '../BuyTrade/ActiveTrades/TradeTimeElapsed';
import { AssetCell } from './AssetCell';
import {
  DisplayTime,
  TableErrorRow,
  TableHeader,
  getExpiry,
  getLockedAmount,
} from './Common';
import { useNavigateToProfile } from './HistoryTable';
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
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { registeredOneCT } = useOneCTWallet();
  const navigateToProfile = useNavigateToProfile();

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
          'User',
        ]
      : [
          'Asset',
          strikePriceHeading,
          'Current Price',
          'Open Time',
          'Time Left',
          'Expiry',
          'Trade Size',
          'payout',
          'Probability',
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
    payout = 7,
    Probability = 8,
    Show = 9,
  }
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const { getPoolInfo } = usePoolInfo();

  const BodyFormatter: any = (row: number, col: number) => {
    if (trades === undefined) return <></>;
    const trade = trades?.[row];
    if (!trade) return 'Problem';

    console.log(trade, 'trade');

    const distanceObject = Variables(
      trade.expiration_time - trade.open_timestamp
    );

    switch (col) {
      case TableColumn.payout:
        if (trade.state === 'QUEUED') return <>-</>;
        return (
          <CellContent
            content={[
              <Display
                data={divide(
                  trade.payout ?? '0',
                  trade.market.poolInfo.decimals
                )}
                precision={2}
                className="!justify-start"
                unit={trade.market.poolInfo.token}
              />,
              // <div className="flex">
              //   ROI :{' '}
              //   {toFixed(
              //     multiply(
              //       divide(
              //         subtract(
              //           trade.amount ?? '0',
              //           trade.totalFee ?? '0'
              //         ) as string,
              //         trade.totalFee ?? '0'
              //       ) as string,
              //       '100'
              //     ),
              //     0
              //   ) + '%'}
              // </div>,
            ]}
          />
        );
      case TableColumn.Show:
        return <Visualized queue_id={trade.queue_id} />;
      case TableColumn.Strike:
        if (trade.state === 'QUEUED') return <>-</>;
        return (
          <Display
            data={divide(trade.strike, 8)}
            precision={trade.market.price_precision.toString().length - 1}
            className="!justify-start"
          />
        );
      case TableColumn.Asset:
        return (
          <AssetCell currentRow={trade} platform={false} split={isMobile} />
        );
      case TableColumn.CurrentPrice:
        return <Price tv_id={trade.market.tv_id} className="!justify-start" />;
      case TableColumn.OpenTime:
        return (
          <DisplayTime ts={trade.open_timestamp} className="!justify-start" />
        );
      case TableColumn.TimeLeft:
        return (
          <div>
            {distanceObject.distance >= 0
              ? formatDistance(distanceObject)
              : '00m:00s'}
          </div>
        );
      case TableColumn.CloseTime:
        return <DisplayTime ts={trade.expiration_time} />;
      case TableColumn.TradeSize:
        if (!isNotMobile) {
          return (
            <div className="flex items-center">
              <Display
                data={divide(trade.trade_size, trade.market.poolInfo.decimals)}
                className="!justify-start"
                // unit={poolInfo.token}
              />{' '}
              <img
                src={getAssetMonochromeImageUrl(trade.market.poolInfo.token)}
                width={13}
                height={13}
                className="inline ml-2"
              />
            </div>
          );
        }
        return (
          <Display
            data={divide(trade.trade_size, trade.market.poolInfo.decimals)}
            className="!justify-start"
            unit={trade.market.poolInfo.token}
            precision={2}
          />
        );
      case TableColumn.Probability:
        return (
          // queuedTradeFallBack(trade) || (
          <div>
            <>
              {/* <Pnl
                configData={trade.market}
                trade={trade}
                poolInfo={trade.market.poolInfo}
                lockedAmmount={lockedAmmount}
              /> */}
              <Probability trade={trade} />{' '}
            </>
          </div>
          // )
        );
      default:
        return <>Unhandled</>;
    }
  };

  const Accordian = (row: number) => {
    const trade = trades?.[row];
    // const [marketPrice] = useAtom(priceAtom);

    if (!trade) return <>Something went wrong.</>;
    const poolInfo = getPoolInfo(trade?.pool?.pool);
    if (!poolInfo) return <>Something went wrong.</>;
    const minClosingTime = getExpiry(trade);

    const headerClass = 'text-[#808191] text-f12';
    const descClass = 'text-[#C3C2D4] text-f2';
    const dateClass = 'text-[#6F6E84] text-f10';
    const durationClass = 'text-[#7F87A7] text-f12';
    const timeClass = 'text-[#C3C2D4] text-f12';
    const duration = formatDistance(
      Variables(minClosingTime - trade.open_timestamp)
    );
    const marketPrecision = trade.market.price_precision.toString().length - 1;
    const lockedAmmount = getLockedAmount(trade, cachedPrices);

    return (
      <div className="px-3 py-2">
        <RowBetween>
          <div className={timeClass}>
            {getDisplayTime(trade.open_timestamp)}
          </div>
          <div className={durationClass}>{duration}</div>
          <div className={timeClass}>{getDisplayTime(minClosingTime)}</div>
        </RowBetween>
        <TradeTimeElapsed trade={trade} />
        <RowBetween className="mt-3">
          <div className={dateClass}>
            {getDisplayDate(trade.open_timestamp)}
          </div>
          <div className={dateClass}>{getDisplayDate(minClosingTime)}</div>
        </RowBetween>

        <RowBetween className="mt-5">
          <ColumnGap gap="3px">
            <div className={headerClass}>Current Price</div>
            <Display
              className="!justify-start"
              data={round(
                getCachedPriceFromKlines(trade.market),
                marketPrecision
              )}
              precision={marketPrecision}
            />
          </ColumnGap>

          <ColumnGap gap="3px">
            <div className={headerClass}>Pnl</div>
            <div className={descClass + ' flex items-center gap-1'}>
              {/* <Pnl
                configData={trade.market}
                trade={trade}
                poolInfo={poolInfo}
                lockedAmmount={lockedAmmount}
                shouldShowUnit={false}
                shouldShowCalculating
              /> */}
              <img
                src={getAssetImageUrl(trade.token)}
                width={13}
                height={13}
                className="inline ml-1"
              />
            </div>
          </ColumnGap>

          <ColumnGap gap="3px">
            <div className={headerClass}>Probability</div>
            <div className={descClass}>
              <Probability trade={trade} className="!justify-start" isColored />
            </div>
          </ColumnGap>
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
        if (isNotMobile && platform) {
          const userAddress = trades?.[idx].user_address;
          if (!userAddress) return;
          navigateToProfile(userAddress.toLowerCase());
        }
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

export const Probability: React.FC<{
  trade: TradeType;
  className?: string;
  isColored?: boolean;
}> = ({ trade, className = '', isColored = false }) => {
  const { price } = useMarketPrice(trade.market.tv_id);

  if (trade.state === 'QUEUED') {
    return <>-</>;
  }
  if (trade.expiration_time === undefined) {
    return <>-</>;
  }
  if (price === undefined) {
    return <>No Price</>;
  }

  const currentEpoch = Math.round(new Date().getTime() / 1000);
  if (currentEpoch > +trade.expiration_time) {
    return <>processing...</>;
  }

  const probability =
    BlackScholes(
      true,
      trade.is_above,
      price,
      +trade.strike / 1e8,
      +trade.expiration_time - currentEpoch,
      0,
      12000 / 1e4
    ) * 100;

  return (
    <Display
      data={probability}
      unit={'%'}
      precision={2}
      className={
        className +
        ' ' +
        (isColored ? (probability > 50 ? 'text-green' : 'text-red') : '')
      }
    />
  );
};
