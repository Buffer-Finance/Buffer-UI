import { divide } from '@Utils/NumString/stringArithmatics';
import { numberWithCommas } from '@Utils/display';
import { getBalance } from '@Views/Common/AccountInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { useOtherChainOverview } from '@Views/DashboardV2/hooks/useOtherChainOverView';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';

export const OverviewOtherChains = ({}: {}) => {
  const { overView: data } = useOtherChainOverview();
  const totalDays = Math.ceil(
    (Date.now() - Date.parse('30 Jan 2023 16:00:00 GMT')) / 86400000
  );
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
            'USDC Fees / Volume',
            'USDC fees / Volume (24h)',
            'Total Traders',
            'Average Trade size',
            'Average Daily Volume',
            'Open Interest',
            'Total Trades',
          ]}
          values={[
            <div className={wrapperClasses}>
              <NumberTooltip
                content={numberWithCommas(data.USDCfees) + ' USDC'}
              >
                <div>{getBalance(data.USDCfees)} USDC </div>
              </NumberTooltip>
              &nbsp;/&nbsp;
              <NumberTooltip
                content={numberWithCommas(data.USDCvolume) + ' USDC'}
              >
                <div> {getBalance(data.USDCvolume)} USDC </div>
              </NumberTooltip>
            </div>,
            <div className={wrapperClasses}>
              <NumberTooltip
                content={numberWithCommas(data.usdc_24_fees) + ' USDC'}
              >
                <div>{getBalance(data.usdc_24_fees)} USDC </div>
              </NumberTooltip>
              &nbsp;/&nbsp;
              <NumberTooltip
                content={numberWithCommas(data.usdc_24_volume) + ' USDC'}
              >
                <div>{getBalance(data.usdc_24_volume)} USDC </div>
              </NumberTooltip>
            </div>,
            <div className={wrapperClasses}>{data.totalTraders}</div>,
            <div className={wrapperClasses}>
              <Display data={data.avgTrade} unit={'USDC'} />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.USDCvolume, totalDays.toString())}
                unit={'USDC'}
              />
            </div>,

            <div>
              {data.openInterest !== null
                ? data.openInterest + ' USDC'
                : 'fetching...'}
            </div>,
            <div>{data.trades !== null ? data.trades : 'fetching...'}</div>,
          ]}
        />
      }
    />
  );
};
