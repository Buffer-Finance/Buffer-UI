import BufferTable from '@Views/Common/BufferTable';
import { CellContent, CellInfo } from '@Views/Common/BufferTable/CellInfo';
import Background from '@Views/BinaryOptions/Tables/style';
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
import {
  AssetCell,
  ErrorMsg,
  PayoutChip,
  StopWatch,
  TradeSize,
} from '@Views/BinaryOptions/Tables/TableComponents';
import { ChangeEvent, useMemo } from 'react';
import { IGQLHistory } from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { BetState } from '@Hooks/useAheadTrades';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { UserAddressColumn } from '@Views/BinaryOptions/Tables/Desktop';

export const tradesCount = 10;

interface IPGDesktopTables {
  className?: string;
  currentPage: number;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  totalPages: number;
  filteredData: IGQLHistory[];
  widths: string[];
  onRowClick?: (index: number) => void;
}

const MergedTradesTable: React.FC<IPGDesktopTables> = ({
  className,
  currentPage,
  onPageChange,
  totalPages,
  filteredData,
  widths,
  onRowClick,
}) => {
  const headNameArray = useMemo(() => {
    return [
      'Asset',
      'Open Time/Queue Time',
      'Close Time/Cancel Time',
      'Time Left/Duration',
      'Trade Size',
      'Status/Reason',
      'User',
    ];
  }, []);

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
        if (
          currentRow.state === BetState.queued ||
          currentRow.state === BetState.cancelled
        )
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

      case 1:
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
        if (currentRow.state === BetState.queued)
          return <CellContent content={['-']} />;

        // if (isHistoryTable) {
        //   return (
        //     <CellContent
        //       content={[
        //         formatDistanceExpanded(
        //           Variables(
        //             +currentRow.expirationTime - +currentRow.creationTime
        //           )
        //         ),
        //       ]}
        //     />
        //   );
        // }

        // return (
        //   <CellInfo
        //     labels={[<StopWatch expiry={+currentRow.expirationTime} />]}
        //     whiteIdx={0}
        //   />
        // );
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

      case 2:
        if (
          currentRow.state === BetState.expired ||
          currentRow.state === BetState.exercised
        )
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
        if (currentRow.state === BetState.active)
          return (
            <CellInfo
              labels={[<StopWatch expiry={+currentRow.expirationTime} />]}
              whiteIdx={0}
            />
          );

      case 3:
        return <TradeSize trade={currentRow} />;

      case 4:
        if (currentRow.state === BetState.cancelled)
          return <>{getErrorFromCode(currentRow?.reason)}</>;
        if (currentRow.state === BetState.active) return <>-</>;
        return <PayoutChip data={currentRow} />;

      case 5:
        return <UserAddressColumn address={currentRow.user.address} />;

      default:
        return <></>;
    }
  };

  return (
    <Background className={className + ' h-full'}>
      <BufferTable
        count={onPageChange ? totalPages : undefined}
        onPageChange={(e, pageNumber) => {
          onPageChange ? onPageChange(e, pageNumber) : null;
        }}
        doubleHeight
        activePage={currentPage}
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
        loading={!filteredData}
        error={<ErrorMsg isHistoryTable={false} />}
        shouldShowMobile={true}
      />
    </Background>
  );
};

export default MergedTradesTable;
