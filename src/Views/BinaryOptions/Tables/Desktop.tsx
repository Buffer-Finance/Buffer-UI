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
import { BetState } from '@Hooks/useAheadTrades';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { getSlicedUserAddress } from '@Utils/getUserAddress';
import { CurrencyBitcoin, Launch } from '@mui/icons-material';
import { priceAtom } from '@Hooks/usePrice';

export const tradesCount = 10;
export const visualizeddAtom = atom([]);
interface IPGDesktopTables {
  className?: string;
  isCancelledTable?: boolean;
  currentPage: number;
  isHistoryTable?: boolean;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  shouldNotDisplayShareVisulise: boolean;
  totalPages: number;
  filteredData: IGQLHistory[];
  showUserAddress?: boolean;
  widths: string[];
  onRowClick?: (index: number) => void;
  shouldShowMobile?: boolean;
}

const PGDesktopTables: React.FC<IPGDesktopTables> = ({
  className,
  currentPage,
  onPageChange,
  shouldNotDisplayShareVisulise,
  totalPages,
  filteredData,
  showUserAddress = false,
  widths,
  onRowClick,
  shouldShowMobile = false,
  isHistoryTable,
  isCancelledTable,
}) => {
  const [visualized, setVisualized] = useAtom(visualizeddAtom);
  const [marketPrice] = useAtom(priceAtom);
  const { shouldConnectWallet } = useOpenConnectionDrawer();
  // console.log(filteredData, 'filteredData');
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
      return [
        'Asset',
        'Strike Price',
        'Trade Size',
        'Status',
        'Queue Time',
        'Cancellation Time',
        'Reason',
        showUserAddress && 'User',
      ].filter((name) => name !== null && name !== undefined && name !== false);
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
    return <TableHeader col={col} headsArr={headNameArray} />;
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
              <div className="w-max">
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
          return (
            <NumberTooltip
              content={`${getDisplayTimeUTC(
                +currentRow.queueTimestamp
              )} ${getDisplayDateUTC(+currentRow.queueTimestamp)} UTC`}
            >
              <div className="w-fit">
                <CellContent
                  content={[
                    `${getDisplayTime(+currentRow.queueTimestamp)}`,
                    `${getDisplayDate(+currentRow.queueTimestamp)}`,
                  ]}
                />
              </div>
            </NumberTooltip>
          );
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
        if (currentRow.state === BetState.cancelled)
          return (
            <NumberTooltip
              content={`${getDisplayTimeUTC(
                +currentRow.cancelTimestamp
              )} ${getDisplayDateUTC(+currentRow.cancelTimestamp)} UTC`}
            >
              <div className="w-fit">
                <CellContent
                  content={[
                    `${getDisplayTime(+currentRow.cancelTimestamp)}`,
                    `${getDisplayDate(+currentRow.cancelTimestamp)}`,
                  ]}
                />
              </div>
            </NumberTooltip>
          );
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
            <div className="w-max">
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
        if (currentRow.state === BetState.cancelled)
          return <>{getErrorFromCode(currentRow?.reason)}</>;
        return <TradeSize trade={currentRow} />;
      case 6:
        if (showUserAddress && currentRow.state === BetState.cancelled)
          return <UserAddressColumn address={currentRow.user.address} />;
        return (
          <ProbabilityPNL
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
    <Background className={className + ' h-full'}>
      <BufferTable
        count={onPageChange ? totalPages : null}
        onPageChange={(e, pageNumber) => {
          onPageChange ? onPageChange(e, pageNumber) : null;
        }}
        shouldShowTroply={false}
        doubleHeight
        activePage={currentPage}
        shouldShowMobile={false}
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
        overflow
        loading={!shouldConnectWallet && !filteredData}
        error={<ErrorMsg isHistoryTable={isHistoryTable || isCancelledTable} />}
        shouldShowMobile={shouldShowMobile}
      />
    </Background>
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

export default PGDesktopTables;

export function getPendingData(currentRow: IGQLHistory, expiryPrice: string) {
  console.log(`currentRow: `, currentRow);
  if (!currentRow && !expiryPrice) return ['0', '0'];
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
