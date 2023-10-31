import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { useToast } from '@Contexts/Toast';
import { priceAtom } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getCachedPriceFromKlines, getPriceFromKlines } from '@TV/useDataFeed';
import { divide, round } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { GreyBtn } from '@Views/Common/V2-Button';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { useSpread } from '@Views/TradePage/Hooks/useSpread';
import {
  closeLoadingAtom,
  selectedOrderToEditAtom,
} from '@Views/TradePage/atoms';
import { TradeType } from '@Views/TradePage/type';
import { secondsToHHMM } from '@Views/TradePage/utils';
import { Launch } from '@mui/icons-material';
import { loeditLoadingAtom } from '../EditModal';
import { AssetCell } from './AssetCell';
import {
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  tableButtonClasses,
} from './Common';
import { Visualized } from './Visualized';

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

const LimitOrderTable = ({
  trades,
  overflow,
}: {
  trades: TradeType[];
  overflow: boolean;
}) => {
  const [marketPrice] = useAtom(priceAtom);
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const cancelLoading = useAtomValue(closeLoadingAtom);
  const { getPoolInfo } = usePoolInfo();
  const { registeredOneCT } = useOneCTWallet();
  const editLoading = useAtomValue(loeditLoadingAtom);
  const { viewOnlyMode } = useUserAccount();

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
  const { data: allSpreads } = useSpread();
  const toastify = useToast();
  const BodyFormatter: any = (row: number, col: number) => {
    const trade = trades?.[row];
    const spread = allSpreads?.[trade.market.tv_id].spread ?? 0;

    const marketPrecision = trade.market.price_precision.toString().length - 1;
    const poolInfo = getPoolInfo(trade.pool.pool);
    if (!trade) return 'Problem';
    const isModificationPending = trade.pending_operation == 'Processing EDIT';
    switch (col) {
      case TableColumn.TriggerPrice:
        return <StrikePriceComponent trade={trade} spread={spread} />;
      case TableColumn.Asset:
        return <AssetCell currentRow={trade} />;
      case TableColumn.CurrentPrice:
        return (
          <Display
            className="!justify-start"
            data={round(
              getCachedPriceFromKlines(trade.market),
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
          <div className="flex items-center ">
            <Visualized queue_id={trade.queue_id} className="mr-[5px]" />

            {!viewOnlyMode && (
              <>
                <GreyBtn
                  className={
                    tableButtonClasses +
                    (isModificationPending || editLoading == trade.queue_id
                      ? ' !text-2 '
                      : '')
                  }
                  onClick={() => {
                    if (isModificationPending) {
                      return toastify({
                        msg: "Can't edit while processing",
                        type: 'error',
                        id: 1212,
                      });
                    }
                    setSelectedTrade({ trade, market: trade.market });
                  }}
                >
                  {isModificationPending || editLoading == trade.queue_id ? (
                    <NumberTooltip
                      content={'Processing the Limit Order modification...'}
                    >
                      <div className="scale-90">
                        <img
                          src="/Gear.png"
                          className="w-[16px]  h-[16px] animate-spin mr-[4px]"
                        />
                      </div>
                    </NumberTooltip>
                  ) : null}
                  Edit
                </GreyBtn>
                <GreyBtn
                  className={tableButtonClasses}
                  onClick={() => handleCancel(trade)}
                  isLoading={
                    cancelLoading?.[trade.queue_id] == 1 ||
                    trade.pending_operation == 'Processing CANCEL'
                  }
                >
                  Cancel
                </GreyBtn>
              </>
            )}
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
      overflow={overflow}
      error={<TableErrorRow msg="No active limit orders." />}
      className="sm:min-w-[800px]"
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
