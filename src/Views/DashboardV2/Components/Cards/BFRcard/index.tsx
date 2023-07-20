import BufferLogo from '@Public/ComponentSVGS/bufferLogo';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { numberWithCommas } from '@Utils/display';
import { getBalance } from '@Views/Common/AccountInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { useBFRdata } from '@Views/DashboardV2/hooks/useReadcalls/useBFRdata';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  keyClasses,
  underLineClass,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';

const BFRcard = () => {
  const tokenName = 'BFR';
  const data = useBFRdata();
  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;

  return (
    <Card
      top={
        <div className="flex items-center">
          <BufferLogo />
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
            'Price',
            <div className="flex flex-wrap">
              <span className="whitespace-nowrap">
                Circulating Supply&nbsp;/&nbsp;
              </span>
              <span className="whitespace-nowrap"> Circulating MC</span>
            </div>,
            <div className="flex flex-wrap">
              <span className="whitespace-nowrap">
                Total Supply&nbsp;/&nbsp;
              </span>
              <span className="whitespace-nowrap">MC</span>
            </div>,
            'Total Staked',
            'Tokens In Liquidity Pool',
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display data={data.price} label="$" precision={4} />
            </div>,
            <div className={wrapperClasses}>
              {data.circulatingSupply ? (
                <>
                  <NumberTooltip
                    content={numberWithCommas(data.circulatingSupply) + ' BFR'}
                  >
                    <div>{getBalance(data.circulatingSupply, 'BFR')}</div>
                  </NumberTooltip>
                  &nbsp;/&nbsp;
                  <NumberTooltip
                    content={
                      '$' +
                      numberWithCommas(
                        multiply(data.circulatingSupply, data.price)
                      )
                    }
                  >
                    <div>
                      $
                      {getBalance(multiply(data.circulatingSupply, data.price))}
                    </div>
                  </NumberTooltip>
                </>
              ) : (
                <>-</>
              )}
            </div>,
            <div className={wrapperClasses}>
              <NumberTooltip
                content={numberWithCommas(data.supply) + ' ' + tokenName}
              >
                <div> {getBalance(data.supply, tokenName)}</div>
              </NumberTooltip>
              &nbsp;/&nbsp;
              <NumberTooltip
                content={
                  '$' + numberWithCommas(multiply(data.supply, data.price))
                }
              >
                <div>${getBalance(multiply(data.supply, data.price))} </div>
              </NumberTooltip>
            </div>,
            <div className={wrapperClasses}>
              <NumberTooltip
                content={
                  data.circulatingSupply
                    ? toFixed(
                        multiply(
                          divide(
                            data.total_staked,
                            data.circulatingSupply
                          ) as string,
                          2
                        ),
                        2
                      ) + '% of the circulating supply has been staked.'
                    : ''
                }
              >
                <div
                  className={
                    underLineClass + ' flex items-center flex-wrap justify-end'
                  }
                >
                  <span className="whitespace-nowrap">
                    {getBalance(data.total_staked) + ' BFR'}
                  </span>
                  &nbsp;/&nbsp;
                  <span className="whitespace-nowrap">
                    {'$' + getBalance(multiply(data.total_staked, data.price))}
                  </span>
                </div>
              </NumberTooltip>
            </div>,
            <div className={wrapperClasses}>
              {data.liquidity_pools_token ? (
                <Display data={data.liquidity_pools_token} unit={tokenName} />
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

export default BFRcard;
