import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { toalTokenXstats, totalStatsType } from '@Views/DashboardV2/types';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { useMemo } from 'react';

function getAverageTradeVolume(volume: string, days: string) {
  return divide(volume, days);
}

const AverageVolume: React.FC<{ data: totalStatsType; keys: string[] }> = ({
  data,
  keys,
}) => {
  const totalDays = useMemo(() => {
    return {
      USDC: Math.ceil(
        (Date.now() - Date.parse('30 Jan 2023 16:00:00 GMT')) / 86400000
      ),
      USDC_POL: Math.ceil(
        (Date.now() - Date.parse('14 APR 2023 16:00:00 GMT')) / 86400000
      ),
      ARB: Math.ceil(
        (Date.now() - Date.parse('17 Mar 2023 017:15:45 GMT')) / 86400000
      ),
    };
  }, []);
  const tokens = usePoolNames();
  const { poolDisplayNameMapping } = usePoolDisplayNames();
  return (
    <div className={wrapperClasses}>
      <Display
        data={getAverageTradeVolume(
          (data.totalstats as toalTokenXstats).totalVolume,
          totalDays.USDC.toString()
        )}
        unit={'USDC'}
        precision={2}
        content={
          <TableAligner
            keysName={keys.map((key) => (
              <span className="whitespace-nowrap">{key}</span>
            ))}
            keyStyle={tooltipKeyClasses}
            valueStyle={tooltipValueClasses}
            values={tokens.map((token, index) => {
              const stats = data[`${token}stats`];
              if (stats)
                return (
                  toFixed(
                    getAverageTradeVolume(
                      (stats as toalTokenXstats).totalVolume,
                      totalDays[token as keyof typeof totalDays].toString()
                    ) as string,
                    2
                  ) +
                  ' ' +
                  poolDisplayNameMapping[token]
                );
              else return '-';
            })}
          />
        }
      />
    </div>
  );
};

export default AverageVolume;
