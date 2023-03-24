import { Display } from '@Views/Common/Tooltips/Display';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { OpenUpDownIndicator } from './OpenUpDownIndicator';
import BufferSortTable from './BufferSortTable';
import { UpTriangle } from 'public/ComponentSVGS/UpTriangle';
import { DOwnTriangle } from 'public/ComponentSVGS/DownTriangle';
import { CurrentPriceComponent } from './CurrentPriceComponent';
import { useNavigate } from 'react-router-dom';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useActiveChain } from '@Hooks/useActiveChain';

export const DashboardTable = ({ dashboardData }: { dashboardData: any[] }) => {
  const navigate = useNavigate();
  const { configContracts } = useActiveChain();
  const headerJSX = [
    { id: 'pair', label: 'Pair' },
    { id: 'currentPrice', label: 'Current Price' },
    { id: 'totalTrades', label: 'Open Up/Open Down' },
    { id: '24h_volume', label: '24h Volume' },
    { id: 'currentUtilization', label: 'Utilization' },
    { id: 'sort_duration', label: 'Minimum/Maximum Duration (HH:MM)' },
    { id: 'max_trade_size', label: 'Max Trade Size' },
    { id: 'payoutForUp', label: 'Payouts' },
    { id: 'is_open', label: 'Status' },
  ];

  const payouts = {
    '0x532321e6a2D8A54cf87E34850A7d55466B1ec197': 70,
    '0x89dD9bA4d290045211A6cE597a98181C7f9D899d': 70,
    '0xbCD52d37F41dA2277aF92617D70931A787f66Fd5': 80,
    '0x5d61FE708c9D41acf59009013f14496d559aad09': 80,
    '0xFE9FAEAA880A6109F2ADF0E4257dC535c7a5Ba20': 60,
    '0x109B92A6A485eF92616fB1aAf2cB0Bca90310D3d': 70,
    '0x5D6f1D376e5EA088532Ae03dBE8F46177c42b814': 60,
    '0xD384131B8697F28E8505cC24e1e405962b88b21F': 60,
    '0x5c61a87C2E3cf9e2bf996e0cF93a7b084557E468': 70,
    '0xAd6b3a99Fe957A9E29D5AA6Cf2b3aC1b8794EFd9': 70,
    '0x63E0af4Ec5Af8D103C1Fb2ab606BD938D3dD27dA': 70,
    '0xA51696a6B909314ce0fb66d180d3f05c21804234': 70,
    '0x7b5E6B8Ae5840F5e78f79689B29C441B90803Cb0': 70,
    '0x6C42CE8098EF47A9E2171d931E89F0fb9fF0465d': 70,
    '0xC17BA7E19c383e3710E27b7aDd64E62379EDA0a3': 70,
    '0x8D7A09DEb687D0F77f47c8B0B3a44015d8cD31Fa': 70,
    '0xAE10C1434Fe50B9C6c65D25A752B43ff43d266aD': 70,
    '0x13779aEB682f922770f1971313F2543E5D5f44e8': 70,
    '0xCBA232eB6B0d3c81d209c921941Ec35f15A9e612': 70,
  };

  const bodyJSX = (
    row: number,
    col: number,
    sortedData: typeof dashboardData
  ) => {
    const currentRow = sortedData[row];
    console.log(currentRow, 'currentRow');
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
          <CellContent
            content={[
              <CurrentPriceComponent
                currentPrice={currentRow.currentPrice}
                price_precision={currentRow.precision.toString().length - 1}
              />,
            ]}
          />
        );
      case 2:
        return (
          <>
            <OpenUpDownIndicator
              openDown={Number(
                divide(
                  currentRow.openDown,
                  configContracts.tokens['USDC'].decimals
                )
              )}
              openUp={Number(
                divide(
                  currentRow.openUp,
                  configContracts.tokens['USDC'].decimals
                )
              )}
            />
            <div className="mt-2">
              Total :{' '}
              <Display
                data={divide(
                  currentRow.totalTrades,
                  configContracts.tokens['USDC'].decimals
                )}
                unit="USDC"
                className="inline"
              />
            </div>
          </>
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
      case 5:
        return (
          <CellContent
            content={[
              currentRow.min_duration + ' / ' + currentRow.max_duration,
            ]}
          />
        );
      case 6:
        return (
          <CellContent
            content={[
              <Display
                data={currentRow.max_trade_size}
                unit="USDC"
                className="!justify-start"
              />,
            ]}
          />
        );
      case 7:
        return (
          <CellContent
            content={[
              <div className="flex items-center gap-1">
                <UpTriangle className={`scale-75`} />
                {payouts[currentRow.address] ? (
                  <Display data={payouts[currentRow.address]} unit="%" />
                ) : (
                  '-'
                )}
              </div>,
              <div className="flex items-center text-3 gap-1">
                <DOwnTriangle className={`scale-75`} />
                {payouts[currentRow.address] ? (
                  <Display data={payouts[currentRow.address]} unit="%" />
                ) : (
                  '-'
                )}
              </div>,
            ]}
          />
        );
      case 8:
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
      widths={['11%', '11%', '18%', '11%', '11%', '13%', '11%', '9%', '5%']}
      shouldShowMobile={true}
    />
  );
};
