import { useActiveChain } from '@Hooks/useActiveChain';
import InfoIcon from '@SVG/Elements/InfoIcon';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { openBlockExplorer } from '@Views/AboveBelow/Helpers/openBlockExplorer';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { getAssetImageUrl } from '@Views/TradePage/utils/getAssetImageUrl';
import { Launch } from '@mui/icons-material';
import { AssetCell } from './Components/AssetCell';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  TradeSize = 2,
  QueueTimestamp = 3,
  CancelTimestamp = 4,
  Reason = 5,
  User = 6,
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
}) => {
  const { activeChain } = useActiveChain();

  const headNameArray = [
    'Asset',
    'Strike Price',
    'Trade Size',
    'Queue Timestamp',
    'Cancel Timestamp',
    'Reason',
  ];

  if (inGlobalContext) {
    headNameArray.push('user');
  }
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = cancelled[row];
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
      case TableColumn.TradeSize:
        if (isMobile) {
          return (
            <div className={`flex items-center`}>
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
                // unit={trade.market.poolInfo.token}
                label={'<'}
              />
              <img
                src={getAssetImageUrl(trade.market.poolInfo.token)}
                width={13}
                height={13}
                className="inline ml-1"
              />
              <InfoIcon
                tooltip="The max amount of trade considering the slippage"
                sm
              />
            </div>
          );
        }
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
