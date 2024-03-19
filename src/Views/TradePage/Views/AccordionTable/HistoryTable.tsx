import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { divide, gt, gte, lte } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import BufferTable from '@Views/Common/BufferTable';
import NumberTooltip from '@Views/Common/Tooltips';

import SuccessIcon from '@Assets/Elements/SuccessIcon';
import FailedSuccess from '@SVG/Elements/FailedSuccess';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { toFixed } from '@Utils/NumString';
import { numberWithCommas } from '@Utils/display';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { Display } from '@Views/Common/Tooltips/Display';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import {
  expiryPriceCache,
  getPriceCacheId,
} from '@Views/TradePage/Hooks/useBuyTradeActions';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { TradeType } from '@Views/TradePage/type';
import { getAssetImageUrl } from '@Views/TradePage/utils/getAssetImageUrl';
import { Launch } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useMedia } from 'react-use';
import { TradeTimeElapsed } from '../BuyTrade/ActiveTrades/TradeTimeElapsed';
import { AssetCell } from './AssetCell';
import {
  DisplayTime,
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  getExpiry,
  queuedTradeFallBack,
} from './Common';
import { Share } from './ShareModal/ShareIcon';
import { getPayout } from './ShareModal/utils';
import { getJackpotKey, useJackpotManager } from 'src/atoms/JackpotState';
import { useJackpotInfo } from '@Views/Jackpot/useJackpotInfo';

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
  ShareOrAddress = 9,
}

const HistoryTable: React.FC<{
  trades: TradeType[] | undefined;
  totalPages: number;
  platform?: boolean;
  activePage: number;
  onlyView?: number[];
  setActivePage: (page: number) => void;
  isLoading: boolean;
  className?: string;
  overflow: boolean;
}> = ({
  trades,
  platform,
  totalPages,
  activePage,
  onlyView,
  setActivePage,
  isLoading,
  className = '',
  overflow = true,
}) => {
  const { getPoolInfo } = usePoolInfo();

  const headNameArray = platform
    ? [
        'Asset',
        'Strike Price',
        'Expiry Price',
        'Open Time',
        'Jackpot',
        'Close Time',
        'Trade Size',
        'Payout',
        'Status',
        'User',
      ]
    : [
        'Asset',
        'Strike Price',
        'Expiry Price',
        'Open Time',
        'Jackpot',
        'Close Time',
        'Trade Size',
        'Payout',
        'Status',
        '',
      ];
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const jackpotManager = useJackpotManager();
  const isNotMobile = useMedia('(min-width:1200px)');
  const isMobile = useMedia('(max-width:600px)');
  const navigateToProfile = useNavigateToProfile();
  const jackpotInfo = useJackpotInfo();

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = trades?.[row];
    console.log(
      `HistoryTable-getJackpotKey(trade): `,
      getJackpotKey(trade),
      jackpotManager.jackpot.jackpots
    );
    const jackpotValue = divide(
      jackpotManager.jackpot.jackpots?.[getJackpotKey(trade)]?.jackpot_amount ||
        trade?.jackpotAmount ||
        '0',
      18
    );
    const isJackpotDisabled = jackpotValue && lte(jackpotValue, '0');
    console.log(
      `HistoryTable-isJackpotDisabled: `,
      isJackpotDisabled,
      jackpotValue
    );
    if (trade === undefined) return <></>;
    // if (!readcallData) return <>no readcall data</>;

    // const maxOi = readcallData.maxOIs[getAddress(trade.target_contract)];

    if (!trade?.pool?.pool) console.log(`trade: `, trade);
    const poolInfo = getPoolInfo(trade.pool.pool);
    let expiryPrice: number | null = trade.expiry_price;
    if (!expiryPrice) {
      const id = getPriceCacheId(trade);
      expiryPrice = expiryPriceCache[id] || 0;
    }
    const { pnl, payout } = getPayout(trade, expiryPrice, poolInfo.decimals);

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
        return <StrikePriceComponent trade={trade} spread={0} />;
      case TableColumn.Asset:
        return (
          <AssetCell
            currentRow={trade}
            split={isMobile}
            // platform={platform}
          />
        );
      case TableColumn.ExpiryPrice:
        if (!expiryPrice) return 'Fetching...';
        return (
          <Display
            className="!justify-start"
            data={divide(expiryPrice, 8)}
            precision={trade.market.price_precision.toString().length - 1}
          />
        );
      case TableColumn.OpenTime:
        return (
          queuedTradeFallBack(trade) || (
            <DisplayTime ts={trade.open_timestamp} />
          )
        );
      case TableColumn.TimeLeft:
        if (
          trade.token == 'ARB' &&
          gte(
            divide(trade.trade_size, 18),
            jackpotInfo?.minSize?.toString() || '1'
          )
        )
          return (
            <div
              className={
                ' font-[500] text-[12px] text-[#C3C2D4]  flex items-center gap-2'
              }
            >
              <Link to={'/Jackpot'}>
                <img
                  className={[
                    'w-[24px] h-[19px]',
                    isJackpotDisabled ? 'opacity-30' : '',
                  ].join(' ')}
                  src="/JV.png"
                />
              </Link>
              <Display
                data={jackpotValue}
                className="!justify-start"
                unit={poolInfo.token}
              />
            </div>
          );
        else return '-';
      case TableColumn.CloseTime:
        return (
          queuedTradeFallBack(trade) || <DisplayTime ts={minClosingTime} />
        );
      case TableColumn.TradeSize:
        if (!isNotMobile) {
          return (
            <div className={'flex items-center'}>
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
            unit={poolInfo.token}
          />
        );
      case TableColumn.Payout:
        if (!expiryPrice) return 'Processing...';
        if (isNotMobile)
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
        else
          return (
            <div className="flex items-center">
              <Display
                label={status.chip == 'Win' ? '+' : ''}
                className={`!justify-start ${
                  gte(pnl?.toString(), '0') ? 'green' : 'red'
                }`}
                data={divide(payout ?? '0', poolInfo.decimals)}
                // unit={poolInfo.token}
              />
              <img
                src={getAssetImageUrl(trade.token)}
                width={13}
                height={13}
                className="inline ml-2"
              />
            </div>
          );
      case TableColumn.Status:
        if (!expiryPrice) return 'Processing...';

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
      case TableColumn.ShareOrAddress:
        if (platform)
          return (
            <div className="flex items-center">
              {getSlicedUserAddress(trade.user_address, 4)}
              {!isNotMobile && (
                <div
                  role="button"
                  onClick={() => {
                    const userAddress = trade.user_address;
                    if (!userAddress) return;
                    navigateToProfile(userAddress.toLowerCase());
                  }}
                >
                  <Launch className="scale-75 mb-1" />
                </div>
              )}
            </div>
          );
        return <Share data={trade} market={trade.market} poolInfo={poolInfo} />;

        return (
          <button
            onClick={() =>
              jackpotManager.addJackpot({
                option_id: trade.option_id,
                target_contract: trade.target_contract,
                jackpot_amount: 12 * 1e18,
                router: trade.target_contract,
                user_address: trade.user_address,
                trade_size: trade.trade_size,
              })
            }
          >
            Adding
          </button>
        );
    }
    return 'Unhandled Body';
  };

  const Accordian = (row: number) => {
    const trade = trades?.[row];

    if (!trade) return <>Something went wrong.</>;
    // if (!readcallData) return <></>;

    const poolInfo = getPoolInfo(trade?.pool?.pool);
    if (!poolInfo) return <>Something went wrong.</>;
    const minClosingTime = getExpiry(trade);
    let expiryPrice: number | null = trade.expiry_price;
    if (!expiryPrice) {
      const id = getPriceCacheId(trade);
      expiryPrice = expiryPriceCache[id] || 0;
    }
    // const maxOi = readcallData.maxOIs[getAddress(trade.target_contract)];
    // const currentOi =
    //   readcallData.currentOIs[getAddress(trade.target_contract)];
    const { pnl, payout } = getPayout(trade, expiryPrice, poolInfo.decimals);
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
        <TradeTimeElapsed trade={trade} stopTime={minClosingTime} />
        <RowBetween className="mt-3">
          <div className={dateClass}>
            {getDisplayDate(trade.open_timestamp)}
          </div>
          <div className={dateClass}>{getDisplayDate(minClosingTime)}</div>
        </RowBetween>

        {platform ? (
          <RowBetween className="mt-5">
            <ColumnGap gap="3px">
              <div className={headerClass}>Strike</div>
              <StrikePriceComponent
                trade={trade}
                spread={0}
                className={descClass}
              />
            </ColumnGap>
            <ColumnGap gap="3px">
              <div className={headerClass}>Expiry</div>
              <div className={descClass}>
                {expiryPrice
                  ? numberWithCommas(
                      toFixed(
                        divide(expiryPrice, 8) as string,
                        trade.market.price_precision.toString().length - 1
                      )
                    )
                  : 'Processing...'}
              </div>
            </ColumnGap>
            <ColumnGap gap="3px">
              <div className={headerClass}>Profit</div>
              <div className={descClass}>
                {expiryPrice
                  ? numberWithCommas(toFixed(pnl, 2))
                  : 'Calculating...'}
                <img
                  src={getAssetImageUrl(trade.token)}
                  width={13}
                  height={13}
                  className="inline ml-1"
                />
              </div>
            </ColumnGap>
          </RowBetween>
        ) : (
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
              <span className={headerClass + ' mr-3'}>Profit</span>
              <span className={descClass}>
                {expiryPrice
                  ? numberWithCommas(toFixed(pnl, 2))
                  : 'Calculating...'}
              </span>
              <img
                src={getAssetImageUrl(trade.token)}
                width={13}
                height={13}
                className="inline ml-1"
              />
              <Share
                data={trade}
                market={trade.market}
                poolInfo={poolInfo}
                iconBgColor="#282B39"
                className="scale-75 ml-3"
              />
            </div>
          </RowBetween>
        )}
      </div>
    );
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
      onRowClick={(idx) => {
        if (isNotMobile && platform) {
          const userAddress = trades?.[idx].user_address;
          if (!userAddress) return;
          navigateToProfile(userAddress.toLowerCase());
        }
        // else setInspectTrade({ trade: trades?.[idx] });
      }}
      showOnly={onlyView}
      error={<TableErrorRow msg="No Trade History." />}
      loading={isLoading}
      className={className}
      overflow={overflow}
      accordianJSX={isNotMobile ? undefined : Accordian}
      doubleHeight={!isNotMobile}
    />
  );
};
export { HistoryTable };

export const useNavigateToProfile = () => {
  const navigate = useNavigate();
  return (userAddress: string) => {
    navigate(`/profile/?user_address=${userAddress}`);
  };
};
