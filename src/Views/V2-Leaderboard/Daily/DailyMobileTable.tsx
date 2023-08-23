import { Skeleton } from '@mui/material';
import React from 'react';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { ILeague } from '../interfaces';
import { useUserAccount } from '@Hooks/useUserAccount';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { Rank } from '../Components/Rank';
import BasicPagination from '@Views/Common/pagination';
import { Launch } from '@mui/icons-material';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { TableAligner } from '../Components/TableAligner';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
} from '@Views/Earn/Components/VestCards';
import { toFixed } from '@Utils/NumString';
import { gte } from 'lodash';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';

export const DailyMobileTable: React.FC<{
  options: ILeague[] | undefined;
  skip: number;
  userData: ILeague[] | undefined;
  onpageChange?: (e: any, page: number) => void;
  count: number;
  nftWinners?: number;
  activePage: number;
  userRank: string;
  onClick: (address: string | undefined) => void;
  isWinrateTable?: boolean;
  isDailyTable?: boolean;
}> = ({
  options,
  skip,
  userData,
  count,
  onpageChange,
  nftWinners,
  activePage,
  userRank,
  onClick,
  isWinrateTable,
  isDailyTable = false,
}) => {
  const { address: account } = useUserAccount();

  if (!options)
    return (
      <Skeleton className="!h-[112px] !transform-none w-full !mt-4 web:hidden !bg-1" />
    );
  if (options.length === 0)
    return (
      <div className="text-center text-f14 text-1 mt-4 bg-1 rounded-lg p-5 table-width">
        No data found.
      </div>
    );
  let user = Number(userRank);
  const UserRow =
    userData?.length && options?.length ? (
      <MobileRow
        {...{
          index: 0,
          currentStanding: { ...userData[0], rank: user },
          user,
          skip,
          userData,
          account,
          nftWinners,
          onClick,
          isWinrateTable,
          isDailyTable,
        }}
      />
    ) : null;

  return (
    <div className=" mt-4 flex flex-col gap-4">
      {!options ? (
        <Skeleton className="!h-[112px] !transform-none w-full !mt-4 web:hidden !bg-1" />
      ) : (
        <>
          {' '}
          {UserRow}
          {options.map((currentStanding, index) => {
            const isUser =
              currentStanding?.user &&
              currentStanding?.user.toLowerCase() === account?.toLowerCase();

            return (
              <MobileRow
                key={currentStanding.id}
                {...{
                  index,
                  currentStanding,
                  user: false,
                  skip,
                  userData,
                  account,
                  nftWinners,
                  onClick,
                  isWinrateTable,
                  isDailyTable,
                }}
              />
            );
          })}
        </>
      )}

      {count && count > 1 ? (
        <div className="mb-5">
          <BasicPagination
            onChange={onpageChange}
            count={count}
            page={activePage}
          />
        </div>
      ) : null}
    </div>
  );
};

const MobileRow = ({
  index,
  currentStanding,
  user,
  skip,
  userData,
  account,
  nftWinners,
  onClick,
  isWinrateTable,
  isDailyTable,
}) => {
  const tokens = usePoolNames();
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'];
  const isUser = user ? true : false;
  const perc = multiply(
    divide(currentStanding.netPnL, currentStanding.volume),
    2
  );
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
              skip={skip}
              userRank={currentStanding.rank}
              nftWinners={nftWinners}
            />
          </div>
          <div className="text-f13 ml-1 flex items-center gap-2">
            {currentStanding?.user.toLowerCase() === account?.toLowerCase() ? (
              <span className="text-1">Your Account</span>
            ) : (
              <div className="flex mt-1">
                <NumberTooltip
                  content={currentStanding?.user || ''}
                  className={isUser && index === 0 ? 'text-1' : ''}
                >
                  <div>
                    {isUser
                      ? 'Your Account'
                      : !currentStanding?.user
                      ? 'Wallet not connected'
                      : currentStanding?.user.slice(0, 4) +
                        '...' +
                        currentStanding?.user.slice(-4)}
                  </div>
                </NumberTooltip>
              </div>
            )}
            <div role="button" onClick={() => onClick(currentStanding?.user)}>
              <Launch className="" />
            </div>
          </div>
        </div>

        {/* Right Side*/}
        <div className="flex flex-col">
          <div className="text-2 text-right">
            {isWinrateTable ? 'Total Trades' : 'Trades'}
          </div>
          <div className="text-1 text-right flex justify-end">
            {!currentStanding.netPnL || currentStanding.netPnL === null ? (
              '-'
            ) : (
              <Display
                data={currentStanding.totalTrades}
                precision={0}
                className="!justify-end"
                content={
                  tokens.length > 1 &&
                  !isDailyTable && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map(
                        (token) =>
                          currentStanding[`${token.toLowerCase()}TotalTrades`]
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
            <div className="text-2 mr-3">
              {isWinrateTable ? 'Trades Won' : 'Net PnL'}
            </div>
            <div>
              {isWinrateTable ? (
                <Display
                  data={currentStanding.tradesWon}
                  precision={0}
                  content={
                    tokens.length > 1 &&
                    !isDailyTable && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map(
                          (token) =>
                            currentStanding[`${token.toLowerCase()}TradesWon`]
                        )}
                      />
                    )
                  }
                />
              ) : currentStanding.netPnL === null ? (
                '-'
              ) : (
                <Display
                  data={perc}
                  label={!isNeg ? '+' : ''}
                  className={`f15 ${!isNeg ? 'green' : 'red-grey'}`}
                  unit={'%'}
                  content={
                    tokens.length > 1 &&
                    !isDailyTable && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map((token) => {
                          const percentage = multiply(
                            divide(
                              currentStanding[
                                `${token.toLowerCase()}NetPnL`
                              ] as string,
                              currentStanding[`${token.toLowerCase()}Volume`]
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
            <div className="text-2 mr-3">
              {isWinrateTable ? 'Win Rate' : 'Total Payout'}
            </div>
            <div>
              {isWinrateTable ? (
                <Display
                  data={divide(currentStanding.winRate, 3)}
                  precision={2}
                  unit="%"
                  content={
                    tokens.length > 1 &&
                    !isDailyTable && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map(
                          (token) =>
                            divide(
                              currentStanding[
                                `${token.toLowerCase()}WinRate`
                              ] as string,
                              3
                            ) + '%'
                        )}
                      />
                    )
                  }
                />
              ) : currentStanding.netPnL === null ? (
                '-'
              ) : (
                <Display
                  data={divide(currentStanding.netPnL, usdcDecimals)}
                  label={gte(currentStanding.netPnL, '0') ? '+' : ''}
                  className={`f15 ${
                    gte(currentStanding.netPnL, '0') ? 'green' : 'red-grey'
                  }`}
                  unit={'USDC'}
                  content={
                    tokens.length > 1 &&
                    !isDailyTable && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map((token) => (
                          <div className="flex justify-end">
                            <Display
                              data={divide(
                                currentStanding[
                                  `${token.toLowerCase()}NetPnL`
                                ] as string,
                                decimals[token]
                              )}
                              label={
                                gte(
                                  currentStanding[
                                    `${token.toLowerCase()}NetPnL`
                                  ] as string,
                                  '0'
                                )
                                  ? '+'
                                  : ''
                              }
                              className={`f15 !ml-auto ${
                                gte(
                                  currentStanding[
                                    `${token.toLowerCase()}NetPnL`
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
            {currentStanding.netPnL === null ? (
              '-'
            ) : (
              <Display
                data={divide(currentStanding.volume, usdcDecimals)}
                unit={'USDC'}
                content={
                  tokens.length > 1 &&
                  !isDailyTable && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) =>
                        toFixed(
                          divide(
                            currentStanding[
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
