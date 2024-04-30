import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IWeeklyLeague } from '@Views/V2-Leaderboard/interfaces';

export const NetPnl: React.FC<{
  currentStanding: IWeeklyLeague;
  tokens: any[];
  className?: string;
}> = ({ currentStanding, tokens, className }) => {
  const perc = multiply(
    divide(currentStanding.totalPnl, currentStanding.totalVolume) as string,
    2
  );
  const isNeg =
    typeof perc === 'string' ? (perc[0] == '-' ? true : false) : perc < 0;
  return (
    <div className="flex items-center text-f15">
      {currentStanding.totalPnl === null ? (
        '-'
      ) : (
        <Display
          data={perc}
          label={!isNeg ? '+' : ''}
          className={`${!isNeg ? 'green' : 'red-grey'} ${className}`}
          unit={'%'}
          content={
            tokens.length > 1 && (
              <TableAligner
                keysName={tokens}
                keyStyle={tooltipKeyClasses}
                valueStyle={tooltipValueClasses}
                values={tokens.map((token) => {
                  const percentage = multiply(
                    divide(
                      currentStanding[`${token.toUpperCase()}Pnl`] as string,
                      currentStanding[`${token.toUpperCase()}Volume`]
                    ) ?? '0',
                    2
                  );
                  const isNegative =
                    typeof percentage === 'string'
                      ? percentage[0] == '-'
                        ? true
                        : false
                      : percentage < 0;
                  return (
                    <Display
                      data={percentage}
                      label={!isNegative ? '+' : ''}
                      className={`f15 ${!isNegative ? 'green' : 'red-grey'}`}
                      unit={'%'}
                    />
                  );
                })}
              />
            )
          }
        />
      )}
    </div>
  );
};
