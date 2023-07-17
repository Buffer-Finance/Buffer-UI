import { Display } from '@Views/Common/Tooltips/Display';
import { useArbitrumOverview } from '@Views/DashboardV2/hooks/useArbitrumOverview';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { toalTokenXstats } from '@Views/DashboardV2/types';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import TotalTrades from './TotalTrades';
import AverageTradeSize from './AverageTradeSize';
import AverageVolume from './AverageVolume';
import LastDayFeesVolume from './LastDayFeesVolume';
import TotalFeesVolume from './TotalFeesVolume';

export const OverviewArbitrum = () => {
  const { overView: data } = useArbitrumOverview();
  // console.log(data);

  const { poolDisplayKeyMapping } = usePoolDisplayNames();
  const keys = useMemo(() => {
    return Object.values(poolDisplayKeyMapping);
  }, [poolDisplayKeyMapping]);

  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      top={'Trading Overview'}
      middle={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={[
            'Fees / Volume',
            'Fees / Volume (24h)',
            'Average Daily Volume',
            'Average Trade size',
            'Total Trades',
            'Open Interest (USDC)',
            'Open Interest (ARB)',
            'Open Interest (USDC-POL)',
            'Total Traders',
          ]}
          values={[
            <TotalFeesVolume data={data.totalStats} keys={keys} />,
            <LastDayFeesVolume data={data.total24hrsStats} keys={keys} />,
            <AverageVolume data={data.totalStats} keys={keys} />,
            <AverageTradeSize data={data.totalStats} keys={keys} />,
            <TotalTrades data={data.totalStats} keys={keys} />,

            <div className={wrapperClasses}>
              <Display
                data={(data.USDCopenInterest as toalTokenXstats)?.openInterest}
                precision={2}
                unit="USDC"
                className="!w-fit"
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={(data.ARBopenInterest as toalTokenXstats)?.openInterest}
                precision={2}
                unit="ARB"
                className="!w-fit"
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={
                  (data.USDC_POLopenInterest as toalTokenXstats)?.openInterest
                }
                precision={2}
                unit="USDC"
                className="!w-fit"
              />
            </div>,
            <div className={wrapperClasses}>{data.totalTraders}</div>,
          ]}
        />
      }
    />
  );
};
