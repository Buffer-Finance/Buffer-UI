import { Skeleton } from '@mui/material';
import FrontArrow from 'src/SVG/frontArrow';
import { getDHMSFromSeconds } from '@Utils/Dates/displayDateTime';
import { divide, gte, multiply } from '@Utils/NumString/stringArithmatics';
import { BufferProgressBar } from '@Views/Common/BufferProgressBar.tsx';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IBLP, IEarn, IesBfr, IiBFR, ITotalRewards } from '../earnAtom';
import { Card } from './Card';
import { Divider } from './Divider';
import { EarnButtons } from './EarnButtons';

import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  underLineClass,
  valueClasses,
} from './VestCards';
import { roundToTwo } from '@Utils/roundOff';
import { toFixed } from '@Utils/NumString';

export const wrapperClasses = 'flex justify-end flex-wrap';

export const getEarnCards = (data: IEarn) => {
  if (!data?.earn)
    return [0, 1, 2, 3].map((index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        className="w-full !h-full min-h-[370px] !transform-none !bg-1"
      />
    ));
  return [
    <Card
      top={'BFR'}
      middle={<IBFRCard data={data.earn.ibfr} />}
      bottom={
        <div className="mt-5">
          <EarnButtons cardNum={0} />
        </div>
      }
    />,
    <Card
      top="Total Rewards"
      bottom={
        <div className="mt-5">
          <EarnButtons cardNum={1} />
        </div>
      }
      middle={<TotalRewards data={data.earn.total_rewards} />}
    />,
    <Card
      top={
        <>
          <NumberTooltip
            content={
              <>
                USDC vault takes counterposition against each trade and collects
                up to 60% of the settlement fee. USDC vault might face drawdowns
                if traders are collectively net profitable.{' '}
                <a
                  href="https://buffer-finance.medium.com/all-you-need-to-know-about-usdc-vaults-liqudity-pool-and-the-blp-token-d743b258da1d"
                  target={'_blank'}
                  className="text-light-blue whitespace-nowrap hover:underline"
                >
                  Read details here
                  <FrontArrow className="tml w-fit inline" />
                </a>
              </>
            }
            className="!py-3"
          >
            <span className={underLineClass}>USDC Vault (BLP Token)</span>
          </NumberTooltip>

          <div className="text-f12 text-3  mt-2">
            Max Capacity&nbsp;:&nbsp;
            <Display
              data={data.earn.blp.maxLiquidity}
              unit="USDC"
              className="inline"
              disable
            />
          </div>
          <div className="max-w-[300px]">
            <BufferProgressBar
              fontSize={12}
              progressPercent={Number(
                multiply(
                  divide(
                    gte(
                      data.earn.blp.currentLiquidity,
                      data.earn.blp.maxLiquidity
                    )
                      ? data.earn.blp.maxLiquidity
                      : data.earn.blp.currentLiquidity,
                    data.earn.blp.maxLiquidity
                  ) ?? '0',
                  2
                )
              )}
            />
          </div>
          {/* <div className="text-3 text-f12 flex  mt-2">
            <img
              src="/lightning.png"
              alt="lightning"
              className="mr-2 mt-[2px] h-[14px]"
            />{" "}
            New Vault (Option trading will start in the the first week of
            January.)
          </div> */}
        </>
      }
      middle={<BLP data={data.earn.blp} unit="BLP" />}
      bottom={
        <div className="mt-5">
          <EarnButtons cardNum={2} />
        </div>
      }
    />,
    <Card
      top="Escrowed BFR"
      middle={<BLP data={data.earn.esBfr} unit="esBFR" />}
      bottom={
        <div className="mt-5">
          <EarnButtons cardNum={3} />
        </div>
      }
    />,
  ];
};

const IBFRCard = ({ data }: { data: IiBFR }) => {
  return (
    <>
      <TableAligner
        keysName={['Price', 'Wallet', 'Staked']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              data={data.price}
              label="$"
              className="w-fit"
              precision={4}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              data={data.user.wallet_balance.token_value}
              unit="BFR"
              className="!justify-end"
            />
            &nbsp;
            <span>
              (
              <Display
                data={data.user.wallet_balance.value_in_usd}
                label="$"
                className="!justify-end inline"
              />
              )
            </span>
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.user.staked.token_value}
              unit="BFR"
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.user.staked.value_in_usd}
                label="$"
              />
              )
            </span>
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={[
          'APR',
          'Rewards',
          'Multiplier Points APR',
          'Boost Percentage',
        ]}
        values={[
          // <div className={`${wrapperClasses}`}>
          //   <Display className="!justify-end" data={data.apr} unit="%" />
          // </div>,
          <div>
            <Display
              className="!justify-end"
              data={data.apr.value}
              placement="bottom"
              unit="%"
              content={
                <span>
                  <TableAligner
                    keysName={data.apr.tooltip.map((s) => s.key)}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={data.apr.tooltip.map((s) => (
                      <Display
                        className="!justify-end"
                        data={s.value}
                        unit="%"
                      />
                    ))}
                  ></TableAligner>
                  <div className="text-left mt-3 font-normal">
                    {data.apr.description}
                  </div>
                </span>
              }
              // unit={isBLPCard && unit}
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.user.rewards}
              label="$"
              placement="bottom"
              content={
                <span>
                  <TableAligner
                    keysName={['USDC', 'Escrowed BFR']}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={[
                      [data.user.usd_reward],
                      [
                        data.user.esBfr_rewards.value_abs,
                        data.user.esBfr_rewards.value_in_usd,
                      ],
                    ].map((s) => (
                      <div className="flex w-fit ml-auto">
                        <Display className="!justify-end" data={s[0]} />
                        {s[1] ? (
                          <>
                            (
                            <Display
                              className="!justify-end"
                              data={s[1]}
                              label="$"
                            />
                            )
                          </>
                        ) : null}
                      </div>
                    ))}
                  ></TableAligner>
                  {/* <div className="text-left mt-3 font-normal">
                    {data.apr.description}
                  </div> */}
                </span>
              }
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.multiplier_points_apr}
              placement="bottom"
              content={'Boost your rewards with Multiplier Points.'}
              unit="%"
            />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.boost_percentage}
              unit="%"
              content={data.boost_percentage_description}
              placement="bottom"
            />
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={['Total Staked', 'Total Supply']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.total_staked.token_value}
              unit="BFR"
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.total_staked.value_in_usd}
                label="$"
              />
              )
            </span>
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.total_supply.token_value}
              unit="BFR"
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.total_supply.value_in_usd}
                label="$"
              />
              )
            </span>
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};

const TotalRewards = ({ data }: { data: ITotalRewards }) => {
  return (
    <>
      <TableAligner
        keysName={['USDC', 'BFR', 'Escrowed BFR']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display data={data.usd.token_value} />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display data={data.bfr.token_value} />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.bfr.value_in_usd}
                label="$"
              />
              )
            </span>
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display data={data.esBfr.token_value} />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.esBfr.value_in_usd}
                label="$"
              />
              )
            </span>
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={['Multiplier Points', 'Staked Multiplier Points']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display className="!justify-end" data={data.multiplier_points} />
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.staked_multiplier_points}
            />
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      {/* <Divider /> */}
      <TableAligner
        keysName={['Total']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display className="!justify-end" data={data.total} label="$" />
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      {/* <Divider /> */}
    </>
  );
};

const BLP = ({ data, unit }: { data: IBLP | IesBfr; unit: string }) => {
  const isBLPCard = unit === 'BLP';
  return (
    <>
      <TableAligner
        keysName={[isBLPCard ? 'Exchange Rate' : 'Price', 'Wallet', 'Staked']}
        values={[
          <div className={`${wrapperClasses}`}>
            {isBLPCard ? (
              <NumberTooltip
                content={
                  'Exchange rate is used to mint and redeem BLP tokens and is calculated as (the total worth of assets in the pool, including profits and losses of all previous trades) / (BLP supply)'
                }
              >
                <div className={underLineClass}>
                  <Display data={'1'} unit={'BLP'} className="inline" />
                  &nbsp;=&nbsp;
                  <Display
                    data={roundToTwo(data.blpToUsdc, 2)}
                    unit={'USDC'}
                    className="inline"
                    content={toFixed(data.blpToUsdc, 4)}
                  />
                </div>
              </NumberTooltip>
            ) : (
              <Display
                className="!justify-end"
                data={data.price}
                label="$"
                precision={4}
              />
            )}
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.user.wallet_balance.token_value}
              unit={unit}
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.user.wallet_balance.value_in_usd}
                unit={'USDC'}
              />
              )
            </span>
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.user.staked.token_value}
              unit={unit}
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.user.staked.value_in_usd}
                unit={'USDC'}
              />
              )
            </span>
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={[
          'APR',
          isBLPCard ? 'Rewards' : 'Multiplier Points APR',
          isBLPCard && 'Lockup Period',
          isBLPCard && 'Withdrawable Amount',
        ]}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.apr.value}
              placement="bottom"
              unit="%"
              content={
                <span>
                  <TableAligner
                    keysName={data.apr.tooltip.map((s) => s.key)}
                    keyStyle={tooltipKeyClasses}
                    valueStyle={tooltipValueClasses}
                    values={data.apr.tooltip.map((s) => (
                      <Display
                        className="!justify-end"
                        data={s.value}
                        unit="%"
                      />
                    ))}
                  ></TableAligner>
                  <div className="text-left mt-3 font-normal">
                    {data.apr.description}
                  </div>
                </span>
              }
              // unit={unit === "BLP" && unit}
            />{' '}
          </div>,
          isBLPCard ? (
            <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={data.user.rewards}
                label="$"
                placement="bottom"
                content={
                  <span>
                    <TableAligner
                      keysName={['USDC', 'Escrowed BFR']}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={[
                        [data.user.usd_reward],
                        [
                          data.user.esBfr_rewards.value_abs,
                          data.user.esBfr_rewards.value_in_usd,
                        ],
                      ].map((s) => (
                        <div className="flex w-fit ml-auto">
                          <Display className="!justify-end" data={s[0]} />
                          {s[1] ? (
                            <>
                              ({' '}
                              <Display
                                className="!justify-end"
                                data={s[1]}
                                label="$"
                              />
                              )
                            </>
                          ) : null}
                        </div>
                      ))}
                    ></TableAligner>
                    {/* <div className="text-left mt-3 font-normal">
                    {data.apr.description}
                  </div> */}
                  </span>
                }
              />
            </div>
          ) : (
            <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={data.multiplier_points_apr}
                placement="bottom"
                content={'Boost your rewards with Multiplier Points.'}
                unit="%"
              />
            </div>
          ),
          isBLPCard && getDHMSFromSeconds(Number(data.lockupPeriod)),

          isBLPCard && (
            <div className={`${wrapperClasses}`}>
              <Display
                className="!justify-end"
                data={data.user.max_unlocked_amount}
                unit="BLP"
              />
            </div>
          ),

          ,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
      <Divider />
      <TableAligner
        keysName={['Total Staked', 'Total Supply']}
        values={[
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.total_staked.token_value}
              unit={unit}
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.total_staked.value_in_usd}
                unit={'USDC'}
              />
              )
            </span>
          </div>,
          <div className={`${wrapperClasses}`}>
            <Display
              className="!justify-end"
              data={data.total_supply.token_value}
              unit={unit}
            />
            &nbsp;
            <span>
              (
              <Display
                className="!justify-end inline"
                data={data.total_supply.value_in_usd}
                unit={'USDC'}
              />
              )
            </span>
          </div>,
        ]}
        keyStyle={keyClasses}
        valueStyle={valueClasses}
      />
    </>
  );
};
