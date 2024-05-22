import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import BasicPagination from '@Views/Common/pagination';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
} from '@Views/Earn/Components/VestCards';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { Rank } from '@Views/V2-Leaderboard/Components/Rank';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IWeeklyLeague } from '@Views/V2-Leaderboard/interfaces';
import { Launch } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { gte } from 'lodash';
import React from 'react';

export const MobileTable: React.FC<{
  options: IWeeklyLeague[] | undefined;
  onClick: (address: string | undefined) => void;
}> = ({ options, onClick }) => {
  const { address: account } = useUserAccount();

  if (!options)
    return (
      <Skeleton className="!h-[112px] !transform-none w-full !mt-4 web:hidden !bg-1" />
    );
  if (options.length === 0)
    return (
      <div className="text-center text-f14 text-1 mx-auto mt-4 bg-1 rounded-lg p-5 table-width">
        No data found.
      </div>
    );

  return (
    <div className=" mt-4 flex flex-col gap-4">
      {!options ? (
        <Skeleton className="!h-[112px] !transform-none w-full !mt-4 web:hidden !bg-1" />
      ) : (
        <>
          {options.map((currentStanding, index) => {
            return (
              <MobileRow
                key={index}
                {...{
                  index,
                  currentStanding,
                  user: false,
                  account,
                  onClick,
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

const MobileRow = ({
  index,
  currentStanding,
  user,
  account,
  onClick,
}: {
  currentStanding: IWeeklyLeague;
  index: number;
  user: boolean | number;
  account: string | undefined;
  onClick: (address: string | undefined) => void;
}) => {
  const tokens = usePoolNames();
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'];
  const isUser = user ? true : false;
  const perc = multiply(
    divide(currentStanding.totalPnl, currentStanding.totalVolume) as string,
    2
  ) as string;
  const isNeg =
    typeof perc === 'string' ? (perc[0] == '-' ? true : false) : perc < 0;

  return (
    <div
      key={index}
      className={`text-f12 bg-1 rounded-lg p-5 table-width margin-auto ${
        user && 'highlight'
      }`}
    >
      {/* FIrst Row */}
      <div className="flex justify-between items-center mb-3">
        {/* Left Side*/}
        <div className="flex items-center">
          <div className="text-buffer-blue text-f14 mx-2">
            <Rank
              row={index}
              isUser={isUser}
              skip={0}
              userRank={index + 1}
              nftWinners={0}
            />
          </div>
          <div className="text-f13 ml-1 flex items-center gap-2">
            {currentStanding?.userAddress.toLowerCase() ===
            account?.toLowerCase() ? (
              <span className="text-1">Your Account</span>
            ) : (
              <div className="flex mt-1">
                <NumberTooltip
                  content={currentStanding?.userAddress || ''}
                  className={isUser && index === 0 ? 'text-1' : ''}
                >
                  <div>
                    {isUser
                      ? 'Your Account'
                      : !currentStanding?.userAddress
                      ? 'Wallet not connected'
                      : currentStanding?.userAddress.slice(0, 4) +
                        '...' +
                        currentStanding?.userAddress.slice(-4)}
                  </div>
                </NumberTooltip>
              </div>
            )}
            <div
              role="button"
              onClick={() => onClick(currentStanding?.userAddress)}
            >
              <Launch className="" />
            </div>
          </div>
        </div>

        {/* Right Side*/}
        <div className="flex flex-col">
          <div className="text-2 text-right">{'Trades'}</div>
          <div className="text-1 text-right flex justify-end">
            {!currentStanding.totalPnl || currentStanding.totalPnl === null ? (
              '-'
            ) : (
              <Display
                data={currentStanding.totalTrades}
                precision={0}
                className="!justify-end"
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map(
                        (token) =>
                          (currentStanding as any)[
                            `${token.toLowerCase()}Trades`
                          ]
                      )}
                    />
                  )
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex justify-between items-center">
        {/* Left Side*/}
        <div className="flex flex-col">
          <div className="flex">
            <div className="text-2 mr-3">{'Net PnL'}</div>
            <div>
              {currentStanding.totalPnl === null ? (
                '-'
              ) : (
                <Display
                  data={perc}
                  label={!isNeg ? '+' : ''}
                  className={`f15 ${!isNeg ? 'green' : 'red-grey'}`}
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
                              (currentStanding as any)[
                                `${token.toLowerCase()}PnL`
                              ] as string,
                              (currentStanding as any)[
                                `${token.toLowerCase()}Volume`
                              ]
                            ) ?? '0',
                            2
                          ) as string;
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
                              className={`f15 ${
                                !isNegative ? 'green' : 'red-grey'
                              }`}
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
          </div>
          <div className="flex">
            <div className="text-2 mr-3">{'Total Payout'}</div>
            <div>
              {currentStanding.totalPnl === null ? (
                '-'
              ) : (
                <Display
                  data={divide(currentStanding.totalPnl, usdcDecimals)}
                  label={gte(currentStanding.totalPnl, '0') ? '+' : ''}
                  className={`f15 ${
                    gte(currentStanding.totalPnl, '0') ? 'green' : 'red-grey'
                  }`}
                  unit={'USDC'}
                  content={
                    tokens.length > 1 && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map((token) => (
                          <div className="flex justify-end">
                            <Display
                              data={divide(
                                (currentStanding as any)[
                                  `${token.toLowerCase()}PnL`
                                ] as string,
                                decimals[token]
                              )}
                              label={
                                gte(
                                  (currentStanding as any)[
                                    `${token.toLowerCase()}PnL`
                                  ] as string,
                                  '0'
                                )
                                  ? '+'
                                  : ''
                              }
                              className={`f15 !ml-auto ${
                                gte(
                                  (currentStanding as any)[
                                    `${token.toLowerCase()}PnL`
                                  ] as string,
                                  '0'
                                )
                                  ? 'green'
                                  : 'red-grey'
                              }`}
                            />
                          </div>
                        ))}
                      />
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side*/}
        <div className="flex flex-col">
          <div className="text-2 text-right">Volume</div>
          <div className="text-3 text-right">
            {currentStanding.totalPnl === null ? (
              '-'
            ) : (
              <Display
                data={divide(currentStanding.totalVolume, usdcDecimals)}
                unit={'USDC'}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) =>
                        toFixed(
                          divide(
                            (currentStanding as any)[
                              `${token.toLowerCase()}Volume`
                            ] as string,
                            decimals[token]
                          ) as string,
                          2
                        )
                      )}
                    />
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
