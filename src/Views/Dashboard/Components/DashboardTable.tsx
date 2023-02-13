import { Display } from '@Views/Common/Tooltips/Display';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { OpenUpDownIndicator } from './OpenUpDownIndicator';
import BufferSortTable from './BufferSortTable';
import { UpTriangle } from 'public/ComponentSVGS/UpTriangle';
import { DOwnTriangle } from 'public/ComponentSVGS/DownTriangle';
import { CurrentPriceComponent } from './CurrentPriceComponent';
import { useNavigate } from 'react-router-dom';

export const DashboardTable = ({ dashboardData }: { dashboardData: any[] }) => {
  const navigate = useNavigate();
  const headerJSX = [
    { id: 'pair', label: 'Pair' },
    { id: 'currentPrice', label: 'Current Price' },
    { id: 'openInterest', label: 'Open Interest' },
    { id: '24h_volume', label: '24h Volume' },
    { id: 'totalTrades', label: 'Open Up/Open Down' },
    { id: 'currentUtilization', label: 'Current Utilization' },
    { id: 'payoutForUp', label: 'Payouts' },
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
          <div className="flex items-center gap-2">
            <img src={currentRow.img} className="max-w-[20px] max-h-[20px]" />
            <>{currentRow.pair}</>
          </div>
        );
      case 1:
        return (
          <CellContent
            content={[
              <CurrentPriceComponent
                currentPrice={currentRow.currentPrice}
                price_precision={currentRow.precision.toString().length - 1}
              />,
              // <div className="flex items-center">
              //   <Stats
              //     arrowStyles={'h-[20px] w-[12px] mt-2'}
              //     fontSize={'text-f13 mbn3'}
              //     info={currentRow['24h_change']}
              //   />
              // </div>,
            ]}
          />
        );
      case 2:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <Display data={currentRow.openInterest} unit={'USDC'} />
              </div>,
            ]}
          />
        );
      case 3:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <Display data={currentRow['24h_volume']} unit={'USDC'} />
              </div>,
            ]}
          />
        );
      case 4:
        return (
          <OpenUpDownIndicator
            openDown={currentRow.openDown}
            openUp={currentRow.openUp}
          />
        );
      case 5:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <Display data={currentRow.currentUtilization} unit="%" />
              </div>,
            ]}
          />
        );
      case 6:
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
      loading={!dashboardData}
      onRowClick={(idx) => {
        // navigate(`/binary/${dashboardData[idx].pair}`);
      }}
      widths={['14%', '14%', '14%', '14%', '20%', '14%', '10%']}
    />
  );
};
