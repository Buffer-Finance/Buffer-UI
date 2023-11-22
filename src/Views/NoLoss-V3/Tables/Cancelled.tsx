import { divide } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { IGQLHistory } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { AssetCell } from '@Views/TradePage/Views/AccordionTable/AssetCell';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { useAtomValue } from 'jotai';
import { openBlockExplorer } from '../Components/Trade/MiddleSection/Tables/LeaderboardTable';
import { useUpdateActiveTournament } from '../Hooks/useUpdateActiveTournament';
import { activeChainAtom } from '../atoms';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  TradeSize = 2,
  QueueTimestamp = 3,
  CancelTimestamp = 4,
  Reason = 5,
  User = 6,
  Tournament = 7,
}

export const Cancelled: React.FC<{
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
  cancelled: IGQLHistory[];
  totalPages: number;
  activePage: number;
  setCancelledPage: (page: number) => void;
  isLoading: boolean;
  error?: React.ReactNode;
  inTournamentContext?: boolean;
  inGlobalContext?: boolean;
}> = ({
  onlyView,
  overflow,
  isMobile,
  activePage,
  cancelled,
  setCancelledPage,
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
    'Trade Size',
    'Queue Timestamp',
    'Cancel Timestamp',
    'Reason',
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
    const trade = cancelled[row];
    switch (col) {
      case TableColumn.Asset:
        return (
          <div className={`${isMobile ? '' : 'pl-[1.6rem]'}`}>
            <AssetCell currentRow={trade} split={isMobile} />
          </div>
        );
      case TableColumn.Strike:
        return (
          <Display
            data={divide(trade.strike, 8)}
            precision={trade.chartData.price_precision.toString().length - 1}
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
      case TableColumn.QueueTimestamp:
        return <DisplayTime ts={trade.queueTimestamp as string} />;
      case TableColumn.CancelTimestamp:
        return <DisplayTime ts={trade.cancelTimestamp as string} />;
      case TableColumn.Reason:
        return trade.reason;
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
      rows={cancelled?.length ?? 0}
      cols={headNameArray.length}
      onRowClick={() => {}}
      widths={['auto']}
      activePage={activePage}
      count={totalPages}
      onPageChange={(e, page) => {
        setCancelledPage(page);
      }}
      error={error}
      showOnly={onlyView}
      overflow={overflow}
      shouldShowMobile
    />
  );
};
