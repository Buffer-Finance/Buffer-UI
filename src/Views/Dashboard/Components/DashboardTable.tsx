import { Display } from '@Views/Common/Tooltips/Display';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { OpenUpDownIndicator } from './OpenUpDownIndicator';
import BufferSortTable from './BufferSortTable';
import { UpTriangle } from 'public/ComponentSVGS/UpTriangle';
import { DOwnTriangle } from 'public/ComponentSVGS/DownTriangle';
import { CurrentPriceComponent } from './CurrentPriceComponent';
import { useNavigate } from 'react-router-dom';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { usePoolDisplayNames } from '../Hooks/useArbitrumOverview';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';

export const DashboardTable = ({
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
  const { poolDisplayKeyMapping } = usePoolDisplayNames();
  const headerJSX = [
    { id: 'pair', label: 'Pair' },
    { id: 'pool', label: 'Pool' },
    { id: 'currentPrice', label: 'Current Price' },
    { id: 'totalTrades', label: 'Open Up/Open Down' },
    { id: '24h_volume', label: '24h Volume' },
    // { id: 'currentUtilization', label: 'Utilization' },
    { id: 'max_open_interest', label: 'Open Interest' },
    { id: 'sort_duration', label: 'Minimum/Maximum Duration (HH:MM)' },
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
          <div className="flex items-center gap-[6px] ">
            <div className="w-[20px] h-[20px]">
              <PairTokenImage pair={currentRow.pair} />
            </div>
            <div className="">{currentRow.pair}</div>
          </div>
        );
      case 1:
        return (
          <span className="whitespace-nowrap">
            {poolDisplayKeyMapping[currentRow.pool]}
          </span>
        );
      case 2:
        return (
          <CellContent
            content={[
              <CurrentPriceComponent
                currentPrice={currentRow.currentPrice}
                price_precision={currentRow.precision.toString().length - 1}
              />,
            ]}
          />
        );
      case 3:
        return (
          <>
            <OpenUpDownIndicator
              openDown={Number(currentRow.openDown)}
              openUp={Number(currentRow.openUp)}
              unit={currentRow.poolUnit}
            />
            <div className="mt-2">
              Total :{' '}
              <Display
                data={currentRow.totalTrades}
                unit={currentRow.poolUnit}
                className="inline"
              />
            </div>
          </>
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

      // case 5:
      //   return (
      //     <CellContent
      //       content={[
      //         <div className="flex items-center">
      //           Current&nbsp;:&nbsp;
      //           <Display data={currentRow.currentUtilization} unit="%" />
      //         </div>,
      //         <div className="flex items-center">
      //           Max&nbsp;:&nbsp;
      //           <Display data={currentRow.max_utilization} unit="%" />
      //         </div>,
      //       ]}
      //     />
      //   );

      case 5:
        return (
          <>
            <div className="max-w-[150px]">
              <BufferProgressBar
                fontSize={12}
                progressPercent={
                  (currentRow.totalTrades * 100) /
                  (currentRow.max_open_interest + currentRow.totalTrades)
                }
              />
            </div>
            <div className="whitespace-nowrap mt-2">
              Max:&nbsp;{' '}
              <Display
                data={currentRow.max_open_interest + currentRow.totalTrades}
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
      widths={[
        '11%',
        '7%',
        '8%',
        '14%',
        '10%',
        '14%',
        '12%',
        '10%',
        '9%',
        '5%',
      ]}
      shouldShowMobile={true}
      activePage={activePage}
      count={count}
      onPageChange={onPageChange}
    />
  );
};
