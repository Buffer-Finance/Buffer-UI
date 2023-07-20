import NumberTooltip from '@Views/Common/Tooltips';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { toalTokenXstats, totalStatsType } from '@Views/DashboardV2/types';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
  underLineClass,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
const TotalTrades: React.FC<{ data: totalStatsType; keys: string[] }> = ({
  data,
  keys,
}) => {
  const tokens = usePoolNames();
  return (
    <NumberTooltip
      content={
        <TableAligner
          keysName={keys.map((key) => (
            <span className="whitespace-nowrap">{key}</span>
          ))}
          keyStyle={tooltipKeyClasses}
          valueStyle={tooltipValueClasses}
          values={tokens.map((token) => {
            const stats = data[`${token}stats`];
            if (stats) return (stats as toalTokenXstats).totalTrades;
            else return '-';
          })}
        />
      }
    >
      <div className={underLineClass}>
        {(data.totalstats as toalTokenXstats).totalTrades}
      </div>
    </NumberTooltip>
  );
};

export default TotalTrades;
