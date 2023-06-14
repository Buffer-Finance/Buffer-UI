import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom } from 'jotai';
import { TableHeader } from '@Views/Pro/Common/TableHead';
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
import {
  signatureCache,
  useOngoingTrades,
} from '@Views/TradePage/Hooks/ongoingTrades';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import {
  AssetCell,
  StrikePriceComponent,
} from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@Views/TradePage/config';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { cancelQueueTrade } from './Common';
import { useToast } from '@Contexts/Toast';

export const tradesCount = 10;
export const visualizeddAtom = atom([]);
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
const priceDecimals = 8;

const LimitOrderTable = () => {
  // const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const [_, ongoingData] = useOngoingTrades();
  const markets = useMarketsConfig();
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const { activeChain } = useActiveChain();

  const { address } = useAccount();
  const toastify = useToast();

  const [cancelLoading, setCancelLoading] = useState<null | number>(null);
  const handleCancel = async (queue_id: number) => {
    if (!address) return;
    if (cancelLoading)
      return toastify({
        msg: 'Please wait for prev transaction.',
        type: 'error',
        id: '232',
      });
    setCancelLoading(queue_id);
    const res = await cancelQueueTrade([queue_id], {
      user_signature: signatureCache,
      user_address: address,
      environment: activeChain.id,
    });
    setCancelLoading(null);
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
    if (!trade) return 'Problem';
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
            data={getPriceFromKlines(marketPrice, { tv_id: 'BTCUSD' })}
          />
        );
      case TableColumn.Duration:
        return (
          <div>
            {formatDistanceExpanded(
              Variables(+trade.expiration_time * 1000 - currentEpoch)
            )}
          </div>
        );
      case TableColumn.OrderExpiry:
        return <DisplayTime ts={+trade.expiration_time * 1000} />;

      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, 6)}
            className="!justify-start"
            unit={tradeMarket?.token1}
          />
        );
      case TableColumn.ActionButtons:
        return (
          <div className="flex items-center">
            <GreyBtn onClick={console.log}>Edit</GreyBtn>
            <GreyBtn
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
      overflow
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
