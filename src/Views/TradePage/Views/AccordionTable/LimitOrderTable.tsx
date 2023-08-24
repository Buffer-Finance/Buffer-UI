import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';

import NumberTooltip from '@Views/Common/Tooltips';
import { divide, round } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import {
  closeLoadingAtom,
  selectedOrderToEditAtom,
} from '@Views/TradePage/atoms';
import { secondsToHHMM } from '@Views/TradePage/utils';
import {
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  tableButtonClasses,
} from './Common';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { TradeType } from '@Views/TradePage/type';
import { AssetCell } from './AssetCell';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';

export const tradesCount = 10;

enum TableColumn {
  Asset = 0,
  TriggerPrice = 1,
  CurrentPrice = 2,
  Duration = 3,
  OrderExpiry = 4,
  TradeSize = 5,
  ActionButtons = 6,
}

const LimitOrderTable = ({ trades }: { trades: TradeType[] }) => {
  const [marketPrice] = useAtom(priceAtom);
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const cancelLoading = useAtomValue(closeLoadingAtom);
  const { getPoolInfo } = usePoolInfo();
  const { registeredOneCT } = useOneCTWallet();

  const headNameArray = [
    'Asset',
    'TriggerPrice',
    'Current Price',
    'Duration',
    'Order Expiry',
    'Trade Size',
    '',
  ];
  //if !registeredOneCT, remove last column
  if (!registeredOneCT) {
    headNameArray.pop();
  }

  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const { cancelHandler } = useCancelTradeFunction();
  const handleCancel = async (trade: TradeType) => {
    cancelHandler(trade);
  };
  const BodyFormatter: any = (row: number, col: number) => {
    const trade = trades?.[row];

    const marketPrecision = trade.market.price_precision.toString().length - 1;
    const poolInfo = getPoolInfo(trade.pool.pool);
    if (!trade) return 'Problem';

    switch (col) {
      case TableColumn.TriggerPrice:
        return <StrikePriceComponent trade={trade} />;
      case TableColumn.Asset:
        return <AssetCell currentRow={trade} />;
      case TableColumn.CurrentPrice:
        return (
          <Display
            className="!justify-start"
            data={round(
              getPriceFromKlines(marketPrice, trade.market),
              marketPrecision
            )}
            precision={marketPrecision}
            // unit={trade.market.token1}
          />
        );
      case TableColumn.Duration:
        const hhmmstr = secondsToHHMM(trade.period).split(':');
        return <div>{hhmmstr[0] + 'h:' + hhmmstr[1] + 'm'}</div>;
      case TableColumn.OrderExpiry:
        return <DisplayTime ts={+trade.limit_order_expiration!} />;

      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            className="!justify-start"
            unit={poolInfo.token}
          />
        );
      case TableColumn.ActionButtons:
        return (
          <div className="flex items-center">
            <GreyBtn
              className={tableButtonClasses}
              onClick={() => setSelectedTrade({ trade, market: trade.market })}
            >
              Edit
            </GreyBtn>
            <GreyBtn
              className={tableButtonClasses}
              onClick={() => handleCancel(trade)}
              isLoading={cancelLoading?.[trade.queue_id] == 1}
            >
              Cancel
            </GreyBtn>
          </div>
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
      overflow
      error={<TableErrorRow msg="No active limit orders." />}
    />
  );
};

export const UserAddressColumn = ({ address }: { address: string }) => {
  if (!address) return <>{address}</>;
  return (
    <CellContent
      content={[
        <NumberTooltip content={address}>
          <div className="flex items-center gap-2">
            {getSlicedUserAddress(address, 5)}{' '}
            <Launch className="invisible group-hover:visible" />
          </div>
        </NumberTooltip>,
      ]}
    />
  );
};

export default LimitOrderTable;

export const DisplayTime = ({ ts }: { ts: number | string }) => {
  return (
    <NumberTooltip
      content={`${getDisplayTimeUTC(+ts)} ${getDisplayDateUTC(+ts)} UTC`}
    >
      <div className="w-max">
        <CellContent
          content={[`${getDisplayTime(+ts)}`, `${getDisplayDate(+ts)}`]}
        />
      </div>
    </NumberTooltip>
  );
};
