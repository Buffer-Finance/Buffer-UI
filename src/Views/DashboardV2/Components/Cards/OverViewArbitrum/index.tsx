import { Display } from '@Views/Common/Tooltips/Display';
import { useArbitrumOverview } from '@Views/DashboardV2/hooks/useArbitrumOverview';
import { useOpenInterest } from '@Views/DashboardV2/hooks/useOpenInterest';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import AverageTradeSize from './AverageTradeSize';
import AverageVolume from './AverageVolume';
import LastDayFeesVolume from './LastDayFeesVolume';
import TotalFeesVolume from './TotalFeesVolume';
import TotalTrades from './TotalTrades';
import OpenInterest from './OpenInterest';

export const OverviewArbitrum = () => {
  const { overView: data } = useArbitrumOverview();

  const { poolDisplayKeyMapping } = usePoolDisplayNames();
  const keys = useMemo(() => {
    return Object.values(poolDisplayKeyMapping);
  }, [poolDisplayKeyMapping]);

  if (!data || Object.keys(data.totalStats).length === 0)
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
            // 'Open Interest',
            'Total Traders',
          ].flat(1)}
          values={[
            <TotalFeesVolume data={data.totalStats} keys={keys} />,
            <LastDayFeesVolume data={data.total24hrsStats} keys={keys} />,
            <AverageVolume data={data.totalStats} keys={keys} />,
            <AverageTradeSize data={data.totalStats} keys={keys} />,
            <TotalTrades data={data.totalStats} keys={keys} />,
            // <OpenInterest data={data.totalStats} keys={keys} />,
            <div className={wrapperClasses}>{data.totalTraders}</div>,
          ].flat(1)}
        />
      }
    />
  );
};
