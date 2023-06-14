import BufferTable from '@Views/Common/BufferTable';
import { CellContent, CellInfo } from '@Views/Common/BufferTable/CellInfo';
import { atom, useAtom, useAtomValue } from 'jotai';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';
import { BlackScholes } from '@Utils/Formulas/blackscholes';

import { Variables } from '@Utils/Time';
import { getIdentifier } from '@Hooks/useGenericHook';
import NumberTooltip from '@Views/Common/Tooltips';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { ChangeEvent, useMemo, useState } from 'react';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { BetState } from '@Hooks/useAheadTrades';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { CurrencyBitcoin, Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';
import {
  OngoingTradeSchema,
  signatureCache,
  useOngoingTrades,
} from '@Views/TradePage/Hooks/ongoingTrades';
import { toFixed } from '@Utils/NumString';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import {
  AssetCell,
  StrikePriceComponent,
} from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { GreyBtn } from '@Views/Common/V2-Button';
import {
  DisplayTime,
  cancelQueueTrade,
  getProbability,
  queuedTradeFallBack,
} from './Common';
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useToast } from '@Contexts/Toast';

export const tradesCount = 10;
export const visualizeddAtom = atom([]);
const headNameArray = [
  'Asset',
  'Strike Price',
  'Current Price',
  'Open Time',
  'Time Left',
  'Close Time',
  'Trade Size',
  'Probability',
];

enum TableColumn {
  Asset = 0,
  Strike = 1,
  CurrentPrice = 2,
  OpenTime = 3,
  TimeLeft = 4,
  CloseTime = 5,
  TradeSize = 6,
  Probability = 7,
}
const priceDecimals = 8;

const OngoingTradesTable = () => {
  // const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const [ongoingData] = useOngoingTrades();
  const markets = useMarketsConfig();
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const [cancelLoading, setCancelLoading] = useState<null | number>(null);
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };
  const toastify = useToast();
  const cancelHandler = async (queuedId: number) => {
    if (!address) return;
    if (cancelLoading)
      return toastify({
        msg: 'Please wait for prev transaction.',
        type: 'error',
        id: '232',
      });
    setCancelLoading(queuedId);
    const res = await cancelQueueTrade([queuedId], {
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
    switch (col) {
      case TableColumn.Strike:
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
      case TableColumn.OpenTime:
        return (
          queuedTradeFallBack(trade) || (
            <DisplayTime ts={trade.queued_timestamp} />
          )
        );
      case TableColumn.TimeLeft:
        let currentEpoch = Math.round(new Date().getTime() / 1000);
        return (
          queuedTradeFallBack(trade, true) || (
            <div>
              {formatDistanceExpanded(
                Variables(+trade.expiration_time - currentEpoch)
              )}
            </div>
          )
        );
      case TableColumn.CloseTime:
        return (
          queuedTradeFallBack(trade) || <DisplayTime ts={trade.close_time} />
        );
      case TableColumn.TradeSize:
        return (
          <Display
            data={divide(trade.trade_size, 6)}
            className="!justify-start"
            unit={tradeMarket?.token1}
          />
        );
      case TableColumn.Probability:
        return queuedTradeFallBack(trade, true) ? (
          <GreyBtn
            className="!text-1"
            onClick={() => {
              cancelHandler(trade.queue_id);
            }}
            isLoading={cancelLoading == trade.queue_id}
          >
            Cancel
          </GreyBtn>
        ) : (
          <div>
            {getProbability(
              trade,
              +getPriceFromKlines(marketPrice, { tv_id: 'BTCUSD' })
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

export default OngoingTradesTable;
