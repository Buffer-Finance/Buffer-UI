import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { useActiveChain } from '@Hooks/useActiveChain';
import InfoIcon from '@SVG/Elements/InfoIcon';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { divide, multiply, subtract } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { openBlockExplorer } from '@Views/AboveBelow/Helpers/openBlockExplorer';
import { BetState } from '@Views/AboveBelow/Hooks/useAheadTrades';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { getAssetMonochromeImageUrl } from '@Views/TradePage/utils/getAssetImageUrl';
import { Launch } from '@mui/icons-material';
import { CurrentPrice } from '../StatusBar/AssetSelector/CurrentPrice';
import { AssetCell } from './Components/AssetCell';
import { PayoutChip } from './Components/PayoutChip';
import { Price } from './Components/Price';
import { Probability } from './Components/Probability';
import { Timer } from './Components/Timer';
import { TradeTimeElapsed } from './Components/TradeTimeElapsed';
import { Visualized } from './Components/Visualized';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  Current = 2,
  OpenTime = 3,
  TimeLeft = 4,
  CloseTime = 5,
  TradeSize = 6,
  PnlProbability = 7,
  Visualization = 8,
  User = 9,
}

export const Active: React.FC<{
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
  active: IGQLHistory[];
  totalPages: number;
  activePage: number;
  setActivePage: (page: number) => void;
  isLoading: boolean;
  error?: React.ReactNode;
  inGlobalContext?: boolean;
}> = ({
  onlyView,
  overflow,
  isMobile,
  activePage,
  active,
  setActivePage,
  totalPages,
  isLoading,
  error,
  inGlobalContext = false,
}) => {
  const { activeChain } = useActiveChain();

  const headNameArray = [
    'Asset',
    'Strike Price',
    'Current Price',
    'Open Time',
    'Time Left',
    'Close Time',
    'Trade Size',
    'Probability',
    'Visualization',
  ];
  if (inGlobalContext) {
    //remove visualization
    headNameArray.splice(TableColumn.Visualization, 1);
    headNameArray.push('user');
  }
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = active[row];
    switch (col) {
      case TableColumn.Asset:
        return (
          <div>
            <AssetCell currentRow={trade} split={isMobile} />
          </div>
        );
      case TableColumn.Strike:
        return (
          <Display
            data={divide(trade.strike, 8)}
            precision={trade.market.price_precision.toString().length - 1}
            className="!justify-start"
          />
        );
      case TableColumn.Current:
        return <Price tv_id={trade.market.tv_id} className="!justify-start" />;
      case TableColumn.OpenTime:
        if (trade.state === BetState.queued)
          return (
            <>
              <PayoutChip data={trade} />
              {/* <DisplayTime
                ts={trade.queueTimestamp as string}
                className="!justify-start"
              /> */}
            </>
          );
        return (
          <DisplayTime
            ts={trade.creationTime as string}
            className="!justify-start"
          />
        );
      case TableColumn.CloseTime:
        return (
          <DisplayTime
            ts={trade.expirationTime as string}
            className="!justify-start"
          />
        );
      case TableColumn.TimeLeft:
        return <Timer trade={trade} />;
      case TableColumn.PnlProbability:
        return (
          <Probability trade={trade} className="!justify-start" isColored />
        );

      case TableColumn.TradeSize:
        if (isMobile) {
          return (
            <div className={`flex items-center`}>
              <Display
                data={divide(
                  trade.totalFee as string,
                  trade.market.poolInfo.decimals
                )}
                precision={2}
                className="!justify-start"
              />
              <img
                src={getAssetMonochromeImageUrl(trade.market.poolInfo.token)}
                width={13}
                height={13}
                className="inline ml-1 mb-[0px]"
              />
            </div>
          );
        }
        if (trade.state === BetState.queued) {
          return (
            <div className="flex gap-2 items-center">
              <Display
                data={divide(
                  multiply(
                    trade.maxFeePerContract as string,
                    trade.numberOfContracts as string
                  ) as string,
                  trade.market.poolInfo.decimals
                )}
                precision={2}
                className="!justify-start"
                unit={trade.market.poolInfo.token}
                label={'<'}
              />
              <InfoIcon
                tooltip="The max amount of trade considering the slippage"
                sm
              />
            </div>
          );
        }
        return (
          <Display
            data={divide(
              trade.totalFee as string,
              trade.market.poolInfo.decimals
            )}
            precision={2}
            className="!justify-start"
            unit={trade.market.poolInfo.token}
          />
        );
      case TableColumn.User:
        return (
          <button
            onClick={() => openBlockExplorer(trade.user, activeChain)}
            className="flex items-center gap-2"
          >
            {getSlicedUserAddress(trade.user, 4)}
            <Launch />
          </button>
        );
      case TableColumn.Visualization:
        if (trade.state === BetState.queued) return <></>;
        return <Visualized queue_id={trade.queueID} />;
      default:
        return <></>;
    }
  };

  const Accordian = (row: number) => {
    if (!isMobile) return <></>;
    const trade = active[row];

    const headerClass = 'text-[#808191] text-f12';
    const descClass = 'text-[#C3C2D4] text-f2';
    const dateClass = 'text-[#6F6E84] text-f10';
    const durationClass = 'text-[#7F87A7] text-f12';
    const timeClass = 'text-[#C3C2D4] text-f12';

    return (
      <div className="px-3 py-2">
        <RowBetween>
          <div className={timeClass}>{getDisplayTime(trade.creationTime)}</div>
          <div className={durationClass}>
            {formatDistance(
              Variables(
                +subtract(
                  trade.expirationTime as string,
                  trade.creationTime as string
                )
              )
            )}
          </div>
          <div className={timeClass}>
            {getDisplayTime(trade.expirationTime)}
          </div>
        </RowBetween>
        <TradeTimeElapsed trade={trade} />
        <RowBetween className="mt-3">
          <div className={dateClass}>
            {getDisplayDate(+(trade.creationTime as string))}
          </div>
          <div className={dateClass}>
            {getDisplayDate(+(trade.expirationTime as string))}
          </div>{' '}
        </RowBetween>

        <RowBetween className="mt-5">
          <ColumnGap gap="3px">
            <div className={headerClass}>Current Price</div>
            <CurrentPrice market={trade.market} />
          </ColumnGap>

          <ColumnGap gap="3px">
            <div className={headerClass}>Probability</div>
            <div className={descClass + ' flex items-center gap-1'}>
              <Probability trade={trade} className="!justify-start" isColored />
            </div>
          </ColumnGap>
        </RowBetween>
      </div>
    );
  };

  return (
    <BufferTable
      bodyJSX={BodyFormatter}
      headerJSX={HeaderFomatter}
      loading={isLoading}
      rows={active?.length ?? 0}
      cols={headNameArray.length}
      onRowClick={() => {}}
      widths={['auto']}
      activePage={activePage}
      count={totalPages}
      onPageChange={(e, page) => {
        setActivePage(page);
      }}
      error={error}
      showOnly={onlyView}
      overflow={overflow}
      shouldShowMobile
      doubleHeight={isMobile}
      accordianJSX={!isMobile ? undefined : Accordian}
    />
  );
};
