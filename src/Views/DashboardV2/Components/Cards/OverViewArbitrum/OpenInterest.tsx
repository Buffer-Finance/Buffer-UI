import { getBalance } from '@Views/Common/AccountInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { toalTokenXstats, totalStatsType } from '@Views/DashboardV2/types';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
  underLineClass,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';

const OpenInterest: React.FC<{ data: totalStatsType; keys: string[] }> = ({
  data,
  keys,
}) => {
  const tokens = usePoolNames();
  const { poolDisplayNameMapping } = usePoolDisplayNames();
  return (
    <div className={wrapperClasses}>
      <NumberTooltip
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
                  <div className={' flex items-center justify-end'}>
                    <div className="whitespace-nowrap">
                      {getBalance((stats as toalTokenXstats).openInterest)}
                      {poolDisplayNameMapping[token]}
                    </div>
                  </div>
                );
              else return <>-</>;
            })}
          />
        }
      >
        <div
          className={
            underLineClass + ' flex items-center flex-wrap justify-end'
          }
        >
          <div className="whitespace-nowrap">
            {getBalance((data.totalstats as toalTokenXstats).openInterest)}
            USDC
          </div>
        </div>
      </NumberTooltip>
    </div>
  );
};

export default OpenInterest;
