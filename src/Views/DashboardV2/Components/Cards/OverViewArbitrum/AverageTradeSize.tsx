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

const AverageTradeSize: React.FC<{ data: totalStatsType; keys: string[] }> = ({
  data,
  keys,
}) => {
  const tokens = usePoolNames();
  const { poolDisplayNameMapping } = usePoolDisplayNames();
  return (
    <div className={wrapperClasses}>
      <Display
        data={divide(
          (data.totalstats as toalTokenXstats).totalVolume,
          (data.totalstats as toalTokenXstats).totalTrades.toString()
        )}
        unit={'USDC'}
        content={
          <TableAligner
            keysName={keys.map((key) => (
              <span className="whitespace-nowrap">{key}</span>
            ))}
            keyStyle={tooltipKeyClasses}
            valueStyle={tooltipValueClasses}
            values={tokens.map((token) => {
              const tokenName = token.includes('.e')
                ? token.replace('.', '_')
                : token;
              const stats = data[`${tokenName}stats`];
              if (stats)
                return (
                  toFixed(
                    divide(
                      (stats as toalTokenXstats).totalVolume,
                      (stats as toalTokenXstats).totalTrades.toString()
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

export default AverageTradeSize;
