import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import BufferSortTable from '@Views/Common/BufferSortTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { Display } from '@Views/Common/Tooltips/Display';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { DOwnTriangle } from 'public/ComponentSVGS/DownTriangle';
import { UpTriangle } from 'public/ComponentSVGS/UpTriangle';
import { useNavigate } from 'react-router-dom';

export const MarketsTable = ({
  dashboardData,
  loading,
  count,
  onPageChange,
  activePage,
}: {
  dashboardData: any[];
  loading: boolean;
  count?: number;
  onPageChange?:
    | ((event: React.ChangeEvent<unknown>, page: number) => void)
    | undefined;
  activePage: number;
}) => {
  const navigate = useNavigate();
  const headerJSX = [
    { id: 'pair', label: 'Pair' },
    { id: 'pool', label: 'Pool' },
    { id: 'currentPrice', label: 'Current Price' },
    { id: 'current_open_interest', label: 'Open Interest' },
    { id: '24h_volume', label: '24h Volume' },
    // { id: 'currentUtilization', label: 'Utilization' },
    { id: 'max_open_interest', label: 'Utilization' },
    { id: 'min_duration', label: 'Minimum/Maximum Duration (HH:MM)' },
    { id: 'max_trade_size', label: 'Max Trade Size' },
    { id: 'payoutForUp', label: 'Payouts' },
    { id: 'is_open', label: 'Status' },
  ];

  const bodyJSX = (
    row: number,
    col: number,
    sortedData: typeof dashboardData
  ) => {
    const currentRow = sortedData[row];
    switch (col) {
      case 0:
        return (
          <div className="flex items-center gap-[6px] ml-4">
            <div className="w-[20px] h-[20px]">
              <PairTokenImage pair={currentRow.pair} />
            </div>
            <div className="">{currentRow.pair}</div>
          </div>
        );
      case 1:
        return <span className="whitespace-nowrap">{currentRow.pool}</span>;
      case 2:
        return <CellContent content={['$' + currentRow.currentPrice]} />;
      case 3:
        return (
          <Display
            data={currentRow.current_open_interest}
            unit={currentRow.poolUnit}
            className="inline"
          />
        );

      case 4:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <Display
                  data={currentRow['24h_volume']}
                  unit={currentRow.poolUnit}
                />
              </div>,
            ]}
          />
        );

      case 5:
        return (
          <>
            <div className="max-w-[150px]">
              <BufferProgressBar
                fontSize={12}
                progressPercent={
                  (currentRow.current_open_interest * 100) /
                  (currentRow.max_open_interest +
                    currentRow.current_open_interest)
                }
              />
            </div>
            <div className="whitespace-nowrap mt-2">
              Max:&nbsp;{' '}
              <Display
                data={currentRow.max_open_interest}
                unit={currentRow.poolUnit}
                className="!inline whitespace-nowrap "
              />
            </div>
          </>
        );
      case 6:
        return (
          <CellContent
            content={[
              currentRow.min_duration + ' / ' + currentRow.max_duration,
            ]}
          />
        );
      case 7:
        return (
          <CellContent
            content={[
              <Display
                data={currentRow.max_trade_size}
                unit={currentRow.poolUnit}
                className="!justify-start"
              />,
            ]}
          />
        );
      case 8:
        return (
          <CellContent
            content={[
              <div className="flex items-center gap-1">
                <UpTriangle className={`scale-75`} />
                <Display data={currentRow.payoutForUp} unit="%" />
              </div>,
              <div className="flex items-center text-3 gap-1">
                <DOwnTriangle className={`scale-75`} />
                <Display data={currentRow.payoutForDown} unit="%" />
              </div>,
            ]}
          />
        );
      case 9:
        return (
          <CellContent
            content={[
              <>
                {currentRow.is_open ? (
                  <div className="text-green flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green" /> Open
                  </div>
                ) : (
                  <div className="text-red flex items-center gap-2">
                    {' '}
                    <div className="h-3 w-3 rounded-full bg-red" />
                    Closed
                  </div>
                )}
              </>,
            ]}
          />
        );

      default:
        return null;
    }
  };
  return (
    <BufferSortTable
      defaultSortId="24h_volume"
      defaultOrder="desc"
      headerJSX={headerJSX}
      cols={headerJSX.length}
      data={dashboardData}
      rows={dashboardData?.length}
      bodyJSX={bodyJSX}
      loading={loading}
      onRowClick={(idx) => {
        navigate(`/binary/${dashboardData[idx].pair}`);
      }}
      widths={['13%', '7%', '8%', '9%', '11%', '14%', '12%', '12%', '9%', '5%']}
      shouldShowMobile={true}
      activePage={activePage}
      count={count}
      onPageChange={onPageChange}
    />
  );
};
