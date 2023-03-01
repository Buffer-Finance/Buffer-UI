import BufferTable from '@Views/Common/BufferTable';
import { CellContent, CellInfo } from '@Views/Common/BufferTable/CellInfo';
import Background from './style';
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
import { getIdentifier } from '@Hooks/useGenericHook';
import NumberTooltip from '@Views/Common/Tooltips';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { IQTrade } from '..';
import { marketPriceAtom } from 'src/TradingView/useDataFeed';
import {
  AssetCell,
  Cancel,
  ErrorMsg,
  ExpiryCurrentComponent,
  PayoutChip,
  ProbabilityPNL,
  Share,
  StopWatch,
  StrikePriceComponent,
  TradeSize,
} from './TableComponents';
import { ChangeEvent, useMemo } from 'react';
import { IGQLHistory } from '../Hooks/usePastTradeQuery';
import { subtract } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { BetState } from '@Hooks/useAheadTrades';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { Launch } from '@mui/icons-material';

export const tradesCount = 10;
export const visualizeddAtom = atom([]);
interface IPGDesktopTables {
  configData: IQTrade;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  activePage: number;
  shouldNotDisplayShareVisulise: boolean;
  totalPages: number;
  filteredData: IGQLHistory[];
  showUserAddress?: boolean;
  widths: string[];
  onRowClick?: (index: number) => void;
}

const PGDesktopTables: React.FC<IPGDesktopTables> = ({
  configData,
  onPageChange,
  activePage,
  shouldNotDisplayShareVisulise,
  totalPages,
  filteredData,
  showUserAddress = false,
  widths,
  onRowClick,
}) => {
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(marketPriceAtom);
  const activeMarket = configData.activePair;

  const { shouldConnectWallet } = useOpenConnectionDrawer();

  const { state } = useGlobal();
  const activeTab = state.tabs.activeIdx;
  const isHistoryTable = activeTab === 'History';
  const isCancelledTable = activeTab === 'Cancelled';

  const headNameArray = useMemo(() => {
    if (isHistoryTable)
      return [
        'Asset',
        'Strike Price',
        'Expiry Price',
        'Open Time',
        'Duration',
        'Close Time',
        'Trade Size',
        'Payout',
        'Status',
        showUserAddress ? 'User' : !shouldNotDisplayShareVisulise && '',
        // "Visualize",
      ].filter((name) => name !== null && name !== undefined && name !== false);
    else if (isCancelledTable)
      return ['Asset', 'Strike Price', 'Trade Size', 'Status', 'Reason'];
    else
      return [
        'Asset',
        'Strike Price',
        'Current Price',
        'Open Time',
        'Time Left',
        'Close Time',
        'Trade Size',
        'Probability',
        showUserAddress
          ? 'User'
          : !shouldNotDisplayShareVisulise && 'Visualize',
      ].filter((name) => name !== null && name !== undefined && name !== false);
  }, [isHistoryTable]);

  const HeaderFomatter = (col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={headNameArray}
        firstColClassName="ml-4"
      />
    );
  };

  const BodyFormatter: any = (row: number, col: number) => {
    const currentRow: IGQLHistory = filteredData[row];
    const openTimeStamp = currentRow?.creationTime;
    col = col - 1;
    if (!currentRow) return;
    switch (col) {
      case -1:
        return (
          <AssetCell
            currentRow={currentRow}
            configData={currentRow.configPair}
          />
        );

      case 0:
        return (
          <CellContent
            content={[
              <StrikePriceComponent
                trade={currentRow}
                configData={currentRow.configPair}
              />,
            ]}
          />
        );

      case 1:
        if (isCancelledTable) return <TradeSize trade={currentRow} />;
        return (
          <ExpiryCurrentComponent
            activeMarket={activeMarket}
            isHistoryTable={isHistoryTable}
            marketPrice={marketPrice}
            trade={currentRow}
            configData={currentRow.configPair}
          />
        );

      case 2:
        if (
          currentRow.state === BetState.queued ||
          currentRow.state === BetState.cancelled
        )
          return <PayoutChip data={currentRow} />;
        else
          return (
            <NumberTooltip
              content={`${getDisplayTimeUTC(
                +openTimeStamp
              )} ${getDisplayDateUTC(+openTimeStamp)} UTC`}
            >
              <div className="w-fit">
                <CellContent
                  content={[
                    `${getDisplayTime(+openTimeStamp)}`,
                    `${getDisplayDate(+openTimeStamp)}`,
                  ]}
                />
              </div>
            </NumberTooltip>
          );

      case 3:
        if (currentRow.state === BetState.cancelled)
          return <>{getErrorFromCode(currentRow?.reason)}</>;
        if (currentRow.state === BetState.queued)
          return <CellContent content={['-']} />;

        if (isHistoryTable) {
          return (
            <CellContent
              content={[
                formatDistanceExpanded(
                  Variables(
                    +currentRow.expirationTime - +currentRow.creationTime
                  )
                ),
              ]}
            />
          );
        }

        return (
          <CellInfo
            labels={[<StopWatch expiry={+currentRow.expirationTime} />]}
            whiteIdx={0}
          />
        );
      case 4:
        // if (!currentRow.normal_option) return <CellContent content={["-"]} />;
        // else
        if (
          currentRow.state === BetState.queued ||
          currentRow.state === BetState.cancelled
        )
          return <CellContent content={['-']} />;
        return (
          <NumberTooltip
            content={`${getDisplayTimeUTC(
              +currentRow.expirationTime
            )} ${getDisplayDateUTC(+currentRow.expirationTime)} UTC`}
          >
            <div className="w-fit">
              <CellContent
                content={[
                  `${getDisplayTime(+currentRow.expirationTime)}`,
                  getDisplayDate(+currentRow.expirationTime),
                ]}
              />
            </div>
          </NumberTooltip>
        );
      case 5:
        return <TradeSize trade={currentRow} />;
      case 6:
        return (
          <ProbabilityPNL
            activeMarket={activeMarket}
            isHistoryTable={isHistoryTable || isCancelledTable}
            marketPrice={marketPrice}
            trade={currentRow}
            configData={currentRow.configPair}
          />
        );

      case 7:
        if (currentRow.state === BetState.queued)
          return <Cancel queue_id={+currentRow?.queueID} />;
        else if (isHistoryTable || isCancelledTable) {
          return (
            <>
              <PayoutChip data={currentRow} />
            </>
          );
        }
        if (showUserAddress)
          return <UserAddressColumn address={currentRow.user.address} />;

        let isPresentInDisabled = visualized.includes(
          getIdentifier(currentRow)
        );
        return (
          <BufferCheckbox
            checked={!isPresentInDisabled}
            onCheckChange={() => {
              const currIdentifier = getIdentifier(currentRow);
              if (isPresentInDisabled) {
                let temp = [...visualized];
                temp.splice(visualized.indexOf(currIdentifier), 1);
                setVisualized(temp);
              } else {
                setVisualized([...visualized, currIdentifier]);
              }
            }}
          />
        );

      case 8:
        // if (!currentRow.normal_option) return <CellContent content={["-"]} />;
        if (showUserAddress)
          return <UserAddressColumn address={currentRow.user.address} />;
        if (
          currentRow.state === BetState.queued ||
          currentRow.state === BetState.cancelled
        )
          return <CellContent content={['-']} />;
        return <Share data={currentRow} />;

      default:
        return <></>;
    }
  };

  return (
    <Background>
      <BufferTable
        count={onPageChange ? totalPages : undefined}
        activePage={activePage}
        onPageChange={(e, pageNumber) => {
          onPageChange ? onPageChange(e, pageNumber) : null;
        }}
        doubleHeight
        // shouldShowMobile
        headerJSX={HeaderFomatter}
        bodyJSX={BodyFormatter}
        cols={headNameArray.length}
        rows={filteredData ? filteredData.length : 0}
        widths={widths}
        onRowClick={
          onRowClick
            ? onRowClick
            : (idx) => {
                // console.log(idx);
              }
        }
        loading={!shouldConnectWallet && !filteredData}
        error={<ErrorMsg isHistoryTable={isHistoryTable || isCancelledTable} />}
      />
    </Background>
  );
};

const UserAddressColumn = ({ address }: { address: string }) => {
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

export default PGDesktopTables;

export function getPendingData(currentRow: IGQLHistory, expiryPrice: string) {
  console.log(`currentRow: `, currentRow);

  let payout = currentRow.amount;
  let pnl = subtract(payout, currentRow.totalFee);
  const currExpiryPrice = expiryPrice;
  if (currExpiryPrice) {
    if (currentRow.isAbove) {
      if (currExpiryPrice > currentRow.strike) {
        // pnl = winPayout;
      } else {
        // pnl = losePayout;
        pnl = subtract('0', currentRow.totalFee);
        payout = '0';
      }
    } else {
      if (currExpiryPrice < currentRow.strike) {
        // pnl = winPayout;
      } else {
        // pnl = losePayout;
        pnl = subtract('0', currentRow.totalFee);
        payout = '0';
      }
    }
  }
  // if (pnl < 0) {
  //   payout = 0;
  // } else {
  //   payout = pnl;
  // }
  return [pnl, payout];
}
