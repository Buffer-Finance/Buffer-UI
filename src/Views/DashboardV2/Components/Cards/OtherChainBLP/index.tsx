import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  keyClasses,
  underLineClass,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { BLPsvg } from './BLPsvg';
import { useOtherChainBLPdata } from '@Views/DashboardV2/hooks/useReadcalls/useOtherChainBLPdata';

export const OtherChainBLP = () => {
  const data = useOtherChainBLPdata();
  console.log(data, 'otherChainBLPData');
  const tokenName = 'BLP';
  if (!data || !data?.price)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;

  return (
    <Card
      top={
        <div className="flex items-center">
          <BLPsvg />
          <div className="flex flex-col ml-2">
            <div>{tokenName}</div>
          </div>
        </div>
      }
      middle={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={[
            'Exchange Rate',
            'Total Supply',
            'Total USDC Amount',
            'POL(USDC)',
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display data={data.price || '0'} unit={'USDC'} precision={4} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={data.supply} unit={tokenName} />
            </div>,

            <div className={wrapperClasses}>
              <Display data={data.total_usdc} unit={'USDC'} />
            </div>,
            <div className={wrapperClasses}>
              {data.usdc_pol ? (
                <NumberTooltip
                  content={
                    toFixed(
                      multiply(
                        divide(data.usdc_pol, data.usdc_total as string) ??
                          ('0' as string),
                        2
                      ),
                      2
                    ) + '% of total liquidity in the USDC vault.'
                  }
                >
                  <div>
                    <Display
                      data={data.usdc_pol || '0'}
                      unit={'USDC'}
                      disable
                      className={underLineClass}
                    />
                  </div>
                </NumberTooltip>
              ) : (
                <>-</>
              )}
            </div>,
          ]}
        />
      }
    />
  );
};
