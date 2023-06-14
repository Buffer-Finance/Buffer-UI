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
import { Variables } from '@Utils/Time';
import { getIdentifier } from '@Hooks/useGenericHook';
import NumberTooltip from '@Views/Common/Tooltips';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { ChangeEvent, useMemo } from 'react';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { BetState } from '@Hooks/useAheadTrades';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { CurrencyBitcoin, Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';
import { useOngoingTrades } from '@Views/TradePage/Hooks/ongoingTrades';
import { toFixed } from '@Utils/NumString';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import {
  AssetCell,
  StrikePriceComponent,
} from '@Views/Common/TableComponents/TableComponents';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPriceFromKlines } from '@TV/useDataFeed';

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
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const [ongoingData] = useOngoingTrades();
  console.log(`OngoingTradesTable-ongoingData: `, ongoingData);
  const markets = useMarketsConfig();
  const HeaderFomatter = (col: number) => {
    return <TableHeader col={col} headsArr={headNameArray} />;
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const trade = ongoingData?.[row];
    console.log(`OngoingTradesTable-trade: `, trade);

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
        return (
          <div>
            <StrikePriceComponent trade={trade} configData={tradeMarket} />
          </div>
        );
      case TableColumn.Asset:
        return (
          <div>
            <AssetCell configData={tradeMarket} currentRow={trade} />
          </div>
        );
      case TableColumn.CurrentPrice:
        return (
          <div>
            <Display
              data={getPriceFromKlines(marketPrice, { tv_id: 'BTCUSD' })}
            />
          </div>
        );
      case TableColumn.OpenTime:
        return (
          <div>
            <DisplayTime ts={trade.queued_timestamp} />
          </div>
        );
      case TableColumn.TimeLeft:
        return (
          <div>
            {formatDistanceExpanded(
              Variables(+trade.expiration_time - +trade.queued_timestamp)
            )}
          </div>
        );
      case TableColumn.CloseTime:
        return (
          <div>
            <DisplayTime ts={trade.expiration_time} />
          </div>
        );
      case TableColumn.TradeSize:
        return (
          <div>
            <Display
              data={divide(trade.trade_size, 6)}
              className="items-start"
              unit={tradeMarket?.token1}
            />
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
