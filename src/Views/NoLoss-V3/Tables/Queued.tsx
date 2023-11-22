import { divide } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { IGQLHistory } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { AssetCell } from '@Views/TradePage/Views/AccordionTable/AssetCell';
import {
  DisplayTime,
  SlippageTooltip,
} from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { Price } from '../Components/Trade/BuyTradeSection/ActiveTrades/Price';
import { openBlockExplorer } from '../Components/Trade/MiddleSection/Tables/LeaderboardTable';
import { useUpdateActiveTournament } from '../Hooks/useUpdateActiveTournament';
import { activeChainAtom } from '../atoms';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  Current = 2,
  QueuedTimestamp = 3,
  TradeSize = 4,
  User = 5,
  Tournament = 6,
}

export const Queued: React.FC<{
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
  queued: IGQLHistory[];
  totalPages: number;
  queuedPage: number;
  setQueuedPage: (page: number) => void;
  isLoading: boolean;
  error?: React.ReactNode;
  inTournamentContext?: boolean;
  inGlobalContext?: boolean;
}> = ({
  onlyView,
  overflow,
  isMobile,
  queuedPage,
  queued,
  setQueuedPage,
  totalPages,
  isLoading,
  error,
  inGlobalContext,
  inTournamentContext,
}) => {
  const { setActiveTournament } = useUpdateActiveTournament();
  const activeChain = useAtomValue(activeChainAtom);

  const headNameArray = [
    'Asset',
    'Strike',
    'Current',
    'Queued Time',
    'Trade Size',
  ];
  if (inTournamentContext && !inGlobalContext) {
    headNameArray.push('User');
  }
  if (inGlobalContext) {
    headNameArray.push('user', 'Tournament');
  }
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = queued[row];
    switch (col) {
      case TableColumn.Asset:
        return (
          <div>
            <AssetCell currentRow={trade} split={isMobile} />
          </div>
        );
      case TableColumn.Strike:
        return (
          <>
            <Display
              data={divide(trade.strike, 8)}
              precision={trade.chartData.price_precision.toString().length - 1}
              className="!justify-start"
            />
            <div className="flex gap-2 align-center">
              <SlippageTooltip
                option={trade as any}
                className="mt-[2px] mr-[3px]"
              />
              Slippage -
              <Display
                data={divide(trade?.slippage as string, 2)}
                unit="%"
                className="mr-[3px]"
                precision={2}
              />
            </div>
          </>
        );
      case TableColumn.Current:
        return (
          <Price tv_id={trade.chartData.tv_id} className="!justify-start" />
        );

      case TableColumn.QueuedTimestamp:
        return (
          <DisplayTime
            ts={trade.queueTimestamp as string}
            className="!justify-start"
          />
        );

      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.totalFee, 18)}
            precision={2}
            className="!justify-start"
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
      case TableColumn.Tournament:
        return (
          <button
            className="flex items-center gap-2"
            onClick={() => {
              setActiveTournament(trade.tournament?.id ?? '0');
            }}
          >
            {trade.tournament?.id ?? '-'}
            <Launch />
          </button>
        );
      default:
        return <></>;
    }
  };

  return (
    <BufferTable
      bodyJSX={BodyFormatter}
      headerJSX={HeaderFomatter}
      loading={isLoading}
      rows={queued?.length ?? 0}
      cols={headNameArray.length}
      onRowClick={() => {}}
      widths={['auto']}
      activePage={queuedPage}
      count={totalPages}
      onPageChange={(e, page) => {
        setQueuedPage(page);
      }}
      error={error}
      showOnly={onlyView}
      overflow={overflow}
      shouldShowMobile
    />
  );
};
