import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom, useSetAtom } from 'jotai';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';

import { Variables } from '@Utils/Time';
import NumberTooltip from '@Views/Common/Tooltips';
import { divide } from '@Utils/NumString/stringArithmatics';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { AssetCell } from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useToast } from '@Contexts/Toast';
import { selectedOrderToEditAtom } from '@Views/TradePage/atoms';
import { cancelQueueTrade, secondsToHHMM } from '@Views/TradePage/utils';
import {
  StrikePriceComponent,
  TableErrorRow,
  TableHeader,
  tableButtonClasses,
} from './Common';
import ErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';

export const tradesCount = 10;
const headNameArray = [
  'Asset',
  'TriggerPrice',
  'Current Price',
  'Duration',
  'Order Expiry',
  'Trade Size',
  '',
];

enum TableColumn {
  Asset = 0,
  TriggerPrice = 1,
  CurrentPrice = 2,
  Duration = 3,
  OrderExpiry = 4,
  TradeSize = 5,
  ActionButtons = 6,
}

const LimitOrderTable = () => {
  // const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const [_, ongoingData] = useOngoingTrades();
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const markets = useMarketsConfig();
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const { activeChain } = useActiveChain();

  const { address } = useAccount();
  const toastify = useToast();

  const [cancelLoading, setCancelLoading] = useState<null | number>(null);
  const { cancelHandler } = useCancelTradeFunction();
  const handleCancel = async (id: number) => {
    cancelHandler(id, cancelLoading, setCancelLoading);
  };
  const BodyFormatter: any = (row: number, col: number) => {
    const trade = ongoingData?.[row];

    const tradeMarket = markets?.find((pair) => {
      const pool = pair.pools.find(
        (pool) =>
          pool.optionContract.toLowerCase() ===
          trade?.target_contract.toLowerCase()
      );
      return !!pool;
    });
    if (!trade || !tradeMarket) return 'Problem';
    let currentEpoch = Math.round(new Date().getTime() / 1000);

    console.log(`LimitOrderTable-trade: `, trade);

    switch (col) {
      case TableColumn.TriggerPrice:
        return <StrikePriceComponent trade={trade} configData={tradeMarket} />;
      case TableColumn.Asset:
        return <AssetCell configData={tradeMarket} currentRow={trade} />;
      case TableColumn.CurrentPrice:
        return (
          <Display
            className="!justify-start"
            data={getPriceFromKlines(marketPrice, tradeMarket)}
            unit={tradeMarket.token1}
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
            data={divide(trade.trade_size, 6)}
            className="!justify-start"
            unit={'USDC'}
          />
        );
      case TableColumn.ActionButtons:
        return (
          <div className="flex items-center">
            <GreyBtn
              className={tableButtonClasses}
              onClick={() => setSelectedTrade({ trade, market: tradeMarket })}
            >
              Edit
            </GreyBtn>
            <GreyBtn
              className={tableButtonClasses}
              onClick={() => handleCancel(trade.queue_id)}
              isLoading={cancelLoading == trade.queue_id}
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
      rows={ongoingData ? ongoingData.length : 0}
      widths={['auto']}
      onRowClick={console.log}
      overflow={400}
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
