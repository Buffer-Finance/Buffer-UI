import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { divide, gte, multiply } from '@Utils/NumString/stringArithmatics';
import BufferTable, {
  BufferTableCell,
  BufferTableRow,
} from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { TableHeader } from '@Views/Common/TableHead';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
} from '@Views/Earn/Components/VestCards';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { Launch } from '@mui/icons-material';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Rank } from '../Components/Rank';
import { TableAligner } from '../Components/TableAligner';
import { IWinrate } from '../Hooks/useWeeklyLeaderboardQuery';
import { ILeague } from '../interfaces';
import { DailyMobileTable } from './DailyMobileTable';
import { LeaderBoardTableStyles } from './stlye';

export const DailyWebTable: React.FC<{
  standings: ILeague[] | IWinrate[] | undefined;
  count: number;
  skip: number;
  onpageChange: (page: number) => void;
  userData?: ILeague[] | undefined;
  nftWinners?: number;
  userRank: string;
  activePage: number;
  isWinrateTable?: boolean;
  isDailyTable?: boolean;
}> = ({
  standings,
  skip,
  count,
  onpageChange,
  userData,
  nftWinners,
  userRank,
  activePage,
  isWinrateTable = false,
  isDailyTable = false,
}) => {
  const { address: account } = useUserAccount();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1200;
  const navigate = useNavigate();
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'];
  const params = useParams();
  const poolNames = usePoolNames();

  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );

  //Memos - to avoid re-rendering
  const firstColPadding = useMemo(() => {
    return {
      head: 'ml-6',
      body: 'ml-4',
    };
  }, []);

  const DailyCols = useMemo(() => {
    return [
      'Rank',
      'User Address',
      'Volume',
      isWinrateTable ? 'Total Trades' : 'Trades',
      isWinrateTable ? 'Trades Won' : 'Net PnL (%)',
      isWinrateTable ? 'Win Rate' : 'Total Payout',
    ];
  }, []);

  const HeaderFormatter = (col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={DailyCols}
        firstColClassName={firstColPadding.head}
      />
    );
  };
  interface IuserData extends ILeague {
    rank: string;
  }
  const BodyFormatter = (
    row: number,
    col: number,
    user: IuserData | undefined
  ) => {
    if (!standings) return <></>;
    let currentStanding: ILeague | IWinrate | IuserData = standings[row];

    if (user) {
      currentStanding = user;
    }
    const isUser = !!user;
    switch (col) {
      case 0:
        return (
          <Rank
            isUser={isUser}
            row={row}
            skip={skip}
            userRank={(currentStanding as IuserData).rank}
            firstColPadding={firstColPadding.body}
            nftWinners={nftWinners}
          />
        );
      case 1:
        return (
          <CellContent
            content={[
              <div className="flex items-center gap-2">
                {currentStanding.user.toLowerCase() ===
                account?.toLowerCase() ? (
                  <span className="text-1">Your Account</span>
                ) : (
                  <div className="flex">
                    <NumberTooltip
                      content={currentStanding.user || ''}
                      className={isUser && row === 0 ? 'text-1' : ''}
                    >
                      <div>
                        {isUser
                          ? 'Your Account'
                          : !currentStanding.user
                          ? 'Wallet not connected'
                          : currentStanding.user.slice(0, 7) +
                            '...' +
                            currentStanding.user.slice(-7)}
                      </div>
                    </NumberTooltip>
                  </div>
                )}
                <Launch className="invisible group-hover:visible" />
              </div>,
            ]}
          />
        );
      case 2:
        return (
          <CellContent
            content={[
              <div className="flex items-center  f14  ">
                {!currentStanding.volume ? (
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
                          values={tokens.map(
                            (token) =>
                              toFixed(
                                divide(
                                  currentStanding[
                                    `${token.toLowerCase()}Volume`
                                  ] as string,
                                  decimals[token]
                                ) as string,
                                2
                              ) +
                              ' ' +
                              token
                          )}
                        />
                      )
                    }
                  />
                )}
              </div>,
            ]}
          />
        );

      case 3:
        return (
          <CellContent
            content={[
              <div>
                {!currentStanding.netPnL || currentStanding.netPnL === null ? (
                  '-'
                ) : (
                  <Display
                    data={currentStanding.totalTrades}
                    precision={0}
                    className="!justify-start"
                    content={
                      tokens.length > 1 &&
                      !isDailyTable && (
                        <TableAligner
                          keysName={tokens}
                          keyStyle={tooltipKeyClasses}
                          valueStyle={tooltipValueClasses}
                          values={tokens.map(
                            (token) =>
                              currentStanding[
                                `${token.toLowerCase()}TotalTrades`
                              ]
                          )}
                        />
                      )
                    }
                  />
                )}
              </div>,
            ]}
          />
        );

      case 4:
        if (isWinrateTable && 'tradesWon' in currentStanding) {
          return (
            <CellContent
              content={[
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
                />,
              ]}
            />
          );
        }
        try {
          const perc = multiply(
            divide(currentStanding.netPnL, currentStanding.volume),
            2
          );
          const isNeg =
            typeof perc === 'string'
              ? perc[0] == '-'
                ? true
                : false
              : perc < 0;
          return (
            <CellContent
              content={[
                <div className="flex items-center">
                  {currentStanding.netPnL === null ? (
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
                                  currentStanding[
                                    `${token.toLowerCase()}Volume`
                                  ]
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
                </div>,
              ]}
            />
          );
        } catch (err) {
          return <div>Bug</div>;
        }

      case 5:
        if (isWinrateTable && 'winRate' in currentStanding) {
          return (
            <CellContent
              content={[
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
                />,
              ]}
            />
          );
        }
        return (
          <CellContent
            content={[
              <div className="flex items-center">
                {currentStanding.netPnL === null ? (
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
                                unit={token}
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
              </div>,
            ]}
          />
        );

      default:
        return <div>Unhandled Cell.</div>;
    }
  };

  const navigateToProfile = (address: string | undefined) => {
    let url = '/profile';
    if (params.chain) url = url + '/' + params.chain;
    if (address === undefined) return;
    navigate(`${url}?user_address=${address}`);
  };

  const topDecorator =
    standings?.length && userData?.length && Number(userRank) !== skip + 1 ? (
      <BufferTableRow onClick={console.log} className="highlight group ">
        {new Array(DailyCols.length).fill(9).map((_, i) => (
          <BufferTableCell
            onClick={() => navigateToProfile(account?.toLowerCase())}
          >
            {BodyFormatter(0, i, {
              ...userData[0],
              rank: userRank,
            })}
          </BufferTableCell>
        ))}
      </BufferTableRow>
    ) : null;

  return (
    <LeaderBoardTableStyles>
      {isMobile && (
        <DailyMobileTable
          options={standings}
          skip={skip}
          userData={userData}
          count={count}
          activePage={activePage}
          userRank={userRank}
          onpageChange={(e, p) => {
            onpageChange(p);
          }}
          nftWinners={nftWinners}
          onClick={navigateToProfile}
          isWinrateTable={isWinrateTable}
          isDailyTable={isDailyTable}
        />
      )}

      <BufferTable
        widths={['16%', '22%', '16%', '14%', '16%', '16%']}
        className="mt-4 tab:mt-[0] tab:mb-6"
        bodyJSX={BodyFormatter}
        cols={DailyCols.length}
        rows={standings?.length ?? 0}
        headerJSX={HeaderFormatter}
        topDecorator={topDecorator}
        onRowClick={(idx) => {
          navigateToProfile(standings?.[idx].user);
        }}
        count={count}
        activePage={activePage}
        onPageChange={(a, p) => {
          onpageChange(p);
        }}
        loading={!standings}
        error={<TableErrorMsg msg="No data found." onClick={() => {}} />}
      />
    </LeaderBoardTableStyles>
  );
};
