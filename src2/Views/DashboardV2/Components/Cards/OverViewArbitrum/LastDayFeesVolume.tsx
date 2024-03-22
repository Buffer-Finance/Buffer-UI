import { getBalance } from '@Views/Common/AccountInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import {
  tokenX24hrsStats,
  total24hrsStatsType,
} from '@Views/DashboardV2/types';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
  underLineClass,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';

const LastDayFeesVolume: React.FC<{
  data: total24hrsStatsType;
  keys: string[];
}> = ({ data, keys }) => {
  const tokens = usePoolNames();
  const { poolDisplayNameMapping, poolDisplayKeyMapping } =
    usePoolDisplayNames();
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
              const stats = data[`${token}24stats`];
              if (stats)
                return (
                  <div className={' flex items-center justify-end'}>
                    <div className="whitespace-nowrap">
                      {getBalance((stats as tokenX24hrsStats).settlementFee)}
                      {poolDisplayNameMapping[token]}
                    </div>
                    &nbsp;/&nbsp;
                    <div className="whitespace-nowrap">
                      {getBalance((stats as tokenX24hrsStats).amount)}
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
            {getBalance((data.total24stats as tokenX24hrsStats).settlementFee)}
            USDC
          </div>
          &nbsp;/&nbsp;
          <div className="whitespace-nowrap">
            {getBalance((data.total24stats as tokenX24hrsStats).amount)}
            USDC
          </div>
        </div>
      </NumberTooltip>
    </div>
  );
};

export default LastDayFeesVolume;
