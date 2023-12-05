import { useActiveChain } from '@Hooks/useActiveChain';
import InfoIcon from '@SVG/Elements/InfoIcon';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { openBlockExplorer } from '@Views/AboveBelow/Helpers/openBlockExplorer';
import { BetState } from '@Views/AboveBelow/Hooks/useAheadTrades';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { AssetCell } from './Components/AssetCell';
import { PayoutChip } from './Components/PayoutChip';
import { Price } from './Components/Price';
import { Probability } from './Components/Probability';
import { Timer } from './Components/Timer';
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
    'Pnl | Probability',
    'Visualization',
  ];
  if (inGlobalContext) {
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
        if (trade.state === BetState.queued) {
          return (
            <div className="flex gap-2 items-center">
              <InfoIcon
                tooltip="The max amount of trade considering the slippage"
                sm
              />
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
                label={'>'}
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
        return <Visualized queue_id={trade.optionID} />;
      default:
        return <></>;
    }
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
    />
  );
};
