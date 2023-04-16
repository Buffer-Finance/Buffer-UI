import { Skeleton } from '@mui/material';
import BufferLogo from 'public/ComponentSVGS/bufferLogo';
import { numberWithCommas } from '@Utils/display';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { getBalance } from '@Views/Common/AccountInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  underLineClass,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IBFR, IBLP, IOverview } from '../interface';
import { otherBlpType } from '../Hooks/useOtherChainCalls';
import {
  arbitrumOverview,
  toalTokenXstats,
  tokenX24hrsStats,
  usePoolDisplayNames,
  usePoolNames,
} from '../Hooks/useArbitrumOverview';
import { useMemo } from 'react';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { useActiveChain } from '@Hooks/useActiveChain';

export const StatsOverView = ({ data }: { data: IOverview }) => {
  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      top={'Overview'}
      middle={
        <TableAligner
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={[
            'USDC Vault (BLP pool)',
            // 'BFR Vault',
            'POL(USDC)',
            // 'POL(BFR)',
            'USDC fees / Volume (24h)',
            // "BFR fees / Volume (24h)",
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display data={data.usdc_vault} unit={'USDC'} />
            </div>,
            // <div className={wrapperClasses}>
            //   <Display data={data.bfr_vault} label={'$'} />
            // </div>,
            <div className={wrapperClasses}>
              {data.usdc_pol ? (
                <NumberTooltip
                  content={
                    toFixed(
                      multiply(divide(data.usdc_pol, data.usdc_total), 2),
                      2
                    ) + '% of total liquidity in the USDC vault.'
                  }
                >
                  <div>
                    <Display
                      data={multiply(data.usdc_pol, data.price) || '0'}
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
            // <div className={wrapperClasses}>
            //   {data.bfr_total !== '0' ? (
            //     <NumberTooltip
            //       content={
            //         toFixed(
            //           multiply(divide(data.bfr_pol, data.bfr_total), 2),
            //           2
            //         ) + '% of total liquidity in the BFR vault.'
            //       }
            //     >
            //       <div>
            //         <Display
            //           data={data.bfr_pol || '0'}
            //           unit={'BFR'}
            //           className={underLineClass}
            //         />
            //       </div>
            //     </NumberTooltip>
            //   ) : (
            //     <>-</>
            //   )}
            // </div>,
            <div className={wrapperClasses}>
              <Display data={data.usdc_24_fees} unit={'USDC'} />
              &nbsp;/&nbsp;
              <Display data={data.usdc_24_volume} unit={'USDC'} />
            </div>,
            // <div className={wrapperClasses}>
            //   {" "}
            //   <Display data={data.bfr_24_fees} label="$" />
            //   &nbsp;/&nbsp;
            //   <Display data={data.bfr_24_volume} label="$" />
            // </div>,
          ]}
        />
      }
    />
  );
};

export const StatsTotalStats = ({ data }: { data: IOverview | null }) => {
  const totalDays = Math.ceil(
    (Date.now() - Date.parse('30 Jan 2023 16:00:00 GMT')) / 86400000
  );
  console.log('totalDays', totalDays);
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
            // "BFR Fees / Volume ",
            'USDC Fees / Volume',
            'USDC fees / Volume (24h)',
            'Total Traders',
            'Average Trade size',
            'Average Daily Volume',
            'Open Interest',
            'Total Trades',
          ]}
          values={[
            // <div className={wrapperClasses}>
            //   {" "}
            //   <Display data={data.BFRfees} label="$" />
            //   &nbsp;/&nbsp;
            //   <Display data={data.BFRvolume} label="$" />
            // </div>,
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
export const OverviewArbitrum = ({
  data,
}: {
  data: arbitrumOverview | null;
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
  const { poolNames: tokens } = usePoolNames();
  const { poolDisplayNameMapping, poolDisplayKeyMapping } =
    usePoolDisplayNames();
  const keys = useMemo(() => {
    return Object.values(poolDisplayKeyMapping);
  }, [poolDisplayKeyMapping]);

  console.log(poolDisplayNameMapping, keys, 'poolDisplayNameMapping');
  function getAverageTradeVolume(volume: string, days: string) {
    return divide(volume, days);
  }
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
            'Fees / Volume',
            'Fees / Volume (24h)',
            'Average Daily Volume',
            'Average Trade size',
            'Total Trades',
            'Open Interest (USDC)',
            'Open Interest (ARB)',
            'Open Interest (USDC-POL)',
            'Total Traders',
          ]}
          values={[
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
                      const stats = data[`${token}stats`];
                      if (stats)
                        return (
                          <div className={' flex items-center justify-end'}>
                            <div className="whitespace-nowrap">
                              {getBalance(
                                (stats as toalTokenXstats).totalSettlementFees
                              )}
                              {poolDisplayNameMapping[token]}
                            </div>
                            &nbsp;/&nbsp;
                            <div className="whitespace-nowrap">
                              {getBalance(
                                (stats as toalTokenXstats).totalVolume
                              )}
                              {poolDisplayNameMapping[token]}
                            </div>
                          </div>
                        );
                      else return <></>;
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
                    {getBalance(
                      (data.totalstats as toalTokenXstats).totalSettlementFees
                    )}
                    USDC
                  </div>
                  &nbsp;/&nbsp;
                  <div className="whitespace-nowrap">
                    {getBalance(
                      (data.totalstats as toalTokenXstats).totalVolume
                    )}
                    USDC
                  </div>
                </div>
              </NumberTooltip>
            </div>,
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
                              {getBalance(
                                (stats as tokenX24hrsStats).settlementFee
                              )}
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
                    {getBalance(
                      (data.total24stats as tokenX24hrsStats).settlementFee
                    )}
                    USDC
                  </div>
                  &nbsp;/&nbsp;
                  <div className="whitespace-nowrap">
                    {getBalance((data.total24stats as tokenX24hrsStats).amount)}
                    USDC
                  </div>
                </div>
              </NumberTooltip>
            </div>,
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
                              totalDays[token].toString()
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
            </div>,
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
                      const stats = data[`${token}stats`];
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
            </div>,
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
            </NumberTooltip>,

            // <NumberTooltip
            //   content={
            //     <TableAligner
            //       keysName={keys}
            //       keyStyle={tooltipKeyClasses}
            //       valueStyle={tooltipValueClasses}
            // values={tokens.map((token) => {
            //   const stats = data[`${token}openInterest`];
            //   if (stats) return (stats as toalTokenXstats).openInterest;
            //   else return '-';
            // })}
            //     />
            //   }
            // >
            //   <div className={underLineClass}>
            //     $
            //     {tokens.reduce((acc, curr) => {
            //       return acc + data[`${curr}openInterest`]?.openInterest || 0;
            //     }, 0)}
            //   </div>
            // </NumberTooltip>,

            <div className={wrapperClasses}>
              {data.openInterest !== null || data.openInterest !== undefined ? (
                <Display
                  data={
                    (data.USDCopenInterest as toalTokenXstats)?.openInterest
                  }
                  precision={2}
                  unit="USDC"
                  className="!w-fit"
                />
              ) : (
                'fetching...'
              )}
            </div>,
            <div className={wrapperClasses}>
              {data.openInterest !== null || data.openInterest !== undefined ? (
                <Display
                  data={(data.ARBopenInterest as toalTokenXstats)?.openInterest}
                  precision={2}
                  unit="USDC"
                  className="!w-fit"
                />
              ) : (
                'fetching...'
              )}
            </div>,
            <div className={wrapperClasses}>
              {(data.USDC_POLopenInterest as toalTokenXstats)?.openInterest !==
              undefined ? (
                <Display
                  data={
                    (data.USDC_POLopenInterest as toalTokenXstats)?.openInterest
                  }
                  precision={2}
                  unit="USDC"
                  className="!w-fit"
                />
              ) : (
                'fetching...'
              )}
            </div>,
            <div className={wrapperClasses}>{data.totalTraders}</div>,
          ]}
        />
      }
    />
  );
};

export const TokensBFR = ({
  data,
  tokenName,
}: {
  data: IBFR;
  tokenName: string;
}) => {
  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  // let bfrDistributionData = null;
  // if (tokenName == "BFR") {
  // data.circulatingSupply = 1e8 - x
  // x = y - 1e8
  // const totalLiquidity = subtract((1e8).toString(), data.circulatingSupply);
  // const notStaked = 1e8 - +totalLiquidity - +data.total_staked;
  // bfrDistributionData = [
  //   {
  //     name: `staked`,
  //     value: +data.total_staked,
  //     color: "#ADA4E1",
  //   },
  //   {
  //     name: `in liquidity`,
  //     value: +totalLiquidity,
  //     color: "#A3E3FF",
  //   },
  //   {
  //     name: `not staked`,
  //     value: notStaked,
  //     color: "#3772FF",
  //   },
  // ];
  // }
  return (
    <Card
      // right={
      //   tokenName === "BFR" &&
      //   data.circulatingSupply &&
      //   bfrDistributionData && (
      //     <Chart bfrDistributionData={bfrDistributionData} />
      //   )
      // }
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
              <Display
                data={multiply(data.total_staked, data.price)}
                label="$"
                content={
                  data.circulatingSupply ? (
                    <>
                      <Display
                        data={multiply(
                          divide(data.total_staked, data.circulatingSupply),
                          2
                        )}
                        unit="%"
                        className="inline"
                      />
                      <span>
                        &nbsp;of the circulating supply has been staked.
                      </span>
                    </>
                  ) : (
                    <></>
                  )
                }
              />
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

export const TokensBLP = ({
  data,
  tokenName,
  poolName,
}: {
  data: IBLP;
  tokenName: string;
  poolName: string;
}) => {
  const { configContracts } = useActiveChain();
  const shouldDisplayPOL = poolName !== 'aBLP';
  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;
  return (
    <Card
      top={
        <div className="flex items-center">
          <div className="w-[28px] h-[28px] mr-[6px]">
            <PairTokenImage
              image2={'/BLPlogo.png'}
              image1={configContracts.tokens[tokenName].img}
            />
          </div>
          <div className="flex flex-col ml-2">
            <div>{poolName}</div>
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
            `Total ${tokenName} Amount`,
            shouldDisplayPOL && `POL(${tokenName})`,
            'APY',
          ].filter((key) => key)}
          values={[
            <div className={wrapperClasses}>
              <Display data={data.price} unit={tokenName} precision={4} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={data.supply} unit={poolName} />
            </div>,

            <div className={wrapperClasses}>
              <Display data={data.total_usdc} unit={tokenName} />
            </div>,
            shouldDisplayPOL && (
              <div className={wrapperClasses}>
                {data.usdc_pol ? (
                  <NumberTooltip
                    content={
                      toFixed(
                        multiply(divide(data.usdc_pol, data.usdc_total), 2),
                        2
                      ) + `% of total liquidity in the ${tokenName} vault.`
                    }
                  >
                    <div>
                      <Display
                        data={multiply(data.usdc_pol, data.price) || '0'}
                        unit={tokenName}
                        disable
                        className={underLineClass}
                      />
                    </div>
                  </NumberTooltip>
                ) : (
                  <>-</>
                )}
              </div>
            ),
            <div className={wrapperClasses}>
              <Display data={data.apr} unit="%" />
            </div>,
          ].filter((value) => value)}
        />
      }
    />
  );
};

export const OtherBLP = ({
  data,
  tokenName,
}: {
  data: otherBlpType;
  tokenName: string;
}) => {
  if (!data)
    return <Skeleton className="!transform-none !h-full min-h-[190px] !bg-1" />;

  return (
    <Card
      top={
        <div className="flex items-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z"
              fill="url(#paint0_linear_1_43)"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.03884 11.577C5.65053 11.0157 6.05242 10.2493 6.73521 10.2493C7.31357 10.2493 7.88046 10.2493 8.45506 10.2493C8.45506 9.6481 8.45506 9.06815 8.45506 8.45278C8.31555 8.45278 8.1969 8.45278 8.07132 8.45278C6.79455 8.45278 5.51076 8.44572 4.23395 8.45989C3.96884 8.45989 3.80837 8.37498 3.66883 8.15574C3.50565 7.898 3.33423 7.64652 3.15566 7.38997C2.96053 7.1096 3.15958 6.72701 3.50129 6.72701C5.4686 6.72701 7.40694 6.72701 9.35278 6.72701C9.82029 6.72701 10.1993 7.10587 10.1993 7.57316C10.1993 9.04217 10.1993 10.5068 10.1993 11.9963C9.65513 11.9963 9.10394 11.9963 8.44807 11.9963C9.33416 13.2836 10.1784 14.5001 11.0505 15.7732C11.9157 14.5284 12.7529 13.3118 13.639 12.0317C13.039 12.0317 12.4947 12.0317 11.9226 12.0317C11.9226 11.7234 11.9226 11.4263 11.9226 11.1308C11.9226 10.6635 12.3016 10.2847 12.7692 10.2847C13.6232 10.2847 14.4788 10.2847 15.3465 10.2847C16.029 10.2847 16.4309 11.0504 16.043 11.6117C14.7274 13.5155 13.4198 15.4077 12.1016 17.32C11.5972 18.0517 10.5161 18.0529 10.0106 17.3219C8.68794 15.4088 7.37169 13.5039 6.03884 11.577Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.8452 8.30555C11.8452 8.0597 11.8452 7.81664 11.8452 7.57316C11.8452 7.10587 12.2242 6.72701 12.6917 6.72701C14.6343 6.72701 16.5732 6.72701 18.5413 6.72701C18.8892 6.72701 19.0894 7.1239 18.8827 7.40359C18.6703 7.69112 18.4609 7.97297 18.2471 8.25271C18.205 8.31215 18.0858 8.33859 18.0017 8.33859C15.9963 8.34519 13.9908 8.33859 11.9854 8.33859C11.9504 8.33859 11.9153 8.32539 11.8452 8.30555Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1_43"
                x1="11.0324"
                y1="7.66886"
                x2="11"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#0DB6D2" />
                <stop offset="1" stop-color="#4326F2" />
              </linearGradient>
            </defs>
          </svg>
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
            // 'APY',
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display data={data.price} unit={'USDC'} precision={4} />
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
                      multiply(divide(data.usdc_pol, data.usdc_total), 2),
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
            // <div className={wrapperClasses}>
            //   <Display data={data.apr} unit="%" />
            // </div>,
          ]}
        />
      }
    />
  );
};
