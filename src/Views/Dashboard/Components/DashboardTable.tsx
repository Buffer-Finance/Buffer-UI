import { Display } from '@Views/Common/Tooltips/Display';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { OpenUpDownIndicator } from './OpenUpDownIndicator';
import BufferSortTable from './BufferSortTable';
import { UpTriangle } from 'public/ComponentSVGS/UpTriangle';
import { DOwnTriangle } from 'public/ComponentSVGS/DownTriangle';
import { CurrentPriceComponent } from './CurrentPriceComponent';
import { useNavigate } from 'react-router-dom';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';

export const DashboardTable = ({ dashboardData }: { dashboardData: any[] }) => {
  const navigate = useNavigate();
  const headerJSX = [
    { id: 'pair', label: 'Pair' },
    { id: 'pool', label: 'Pool' },
    { id: 'currentPrice', label: 'Current Price' },
    { id: 'totalTrades', label: 'Open Up/Open Down' },
    { id: '24h_volume', label: '24h Volume' },
    { id: 'currentUtilization', label: 'Utilization' },
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
        return currentRow.pool;
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
              unit={currentRow.pool}
            />
            <div className="mt-2">
              Total :{' '}
              <Display
                data={currentRow.totalTrades}
                unit={currentRow.pool}
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
                  unit={currentRow.pool}
                />
              </div>,
            ]}
          />
        );

      case 5:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                Current&nbsp;:&nbsp;
                <Display data={currentRow.currentUtilization} unit="%" />
              </div>,
              <div className="flex items-center">
                Max&nbsp;:&nbsp;
                <Display data={currentRow.max_utilization / 100} unit="%" />
              </div>,
            ]}
          />
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
                unit={currentRow.pool}
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
      loading={!dashboardData.length}
      onRowClick={(idx) => {
        navigate(`/binary/${dashboardData[idx].pair}`);
      }}
      widths={[
        '11%',
        '5%',
        '10%',
        '16%',
        '11%',
        '10%',
        '12%',
        '11%',
        '9%',
        '5%',
      ]}
      shouldShowMobile={true}
    />
  );
};
