import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { divide, gte } from '@Utils/NumString/stringArithmatics';
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
import { NetPnl } from '../Leagues/WinnersByPnl/NetPnl';
import { IWeeklyLeague } from '../interfaces';
import { DailyMobileTable } from './DailyMobileTable';
import { LeaderBoardTableStyles } from './style';

const GAINERS_POINT_BY_INDEX = [
  1374.57, 1188.0, 1026.75, 887.39, 766.95, 662.85, 572.89, 495.13, 427.93,
  369.85, 319.65, 276.26, 238.77, 206.36, 178.35, 154.14, 133.22, 115.14, 99.51,
  86.01, 74.33, 64.24, 55.52, 47.99, 41.47, 35.84, 30.98, 26.77, 23.14, 20.0,
];
// # The points for the top 10 losers of the day
const LOOSERS_POINT_BY_INDEX = [
  1826.76, 1563.41, 1338.02, 1145.13, 980.05, 838.76, 717.84, 614.36, 525.79,
  449.99,
];

export const DailyWebTable: React.FC<{
  winners: IWeeklyLeague[] | undefined;
  loosers: IWeeklyLeague[] | undefined;
  total_count: number;
  count: number;
  skip: number;
  onpageChange: (page: number) => void;
  userData?: IWeeklyLeague[] | undefined;
  nftWinners?: number;
  userRank: string;
  activePage: number;
  isWinrateTable?: boolean;
  isDailyTable?: boolean;
  offSet: string;
}> = ({
  winners,
  skip,
  count,
  onpageChange,
  userData,
  nftWinners,
  userRank,
  activePage,
  isWinrateTable = false,
  isDailyTable = false,
  offSet,
  loosers,
  total_count,
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
      offSet !== '0' ? 'Rewards' : 'Points',
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

  let totalRows = 0;
  if (winners !== undefined && loosers !== undefined) {
    totalRows = winners.length + loosers.length;
  } else if (winners !== undefined && loosers === undefined) {
    totalRows = winners.length;
  } else if (winners === undefined && loosers !== undefined) {
    totalRows = loosers.length;
  }

  const BodyFormatter = (
    row: number,
    col: number,
    user: IWeeklyLeague | undefined
  ) => {
    if (!winners || !loosers) return <></>;
    const total = winners.concat(loosers);
    let currentStanding: IWeeklyLeague = total[row];
    console.log('currentStanding', total, currentStanding);
    if (user) {
      currentStanding = user;
    }
    const isUser = !!user;
    const rank =
      row > winners.length - 1
        ? row + 1
        : total_count - loosers.length + row + 1;
    switch (col) {
      case 0:
        return (
          <Rank
            isUser={isUser}
            row={row}
            skip={skip}
            userRank={rank}
            firstColPadding={firstColPadding.body}
            nftWinners={nftWinners}
          />
        );
      case 1:
        return (
          <CellContent
            content={[
              <div className="flex items-center gap-2">
                {currentStanding.userAddress.toLowerCase() ===
                account?.toLowerCase() ? (
                  <span className="text-1">Your Account</span>
                ) : (
                  <div className="flex">
                    <NumberTooltip
                      content={currentStanding.userAddress || ''}
                      className={isUser && row === 0 ? 'text-1' : ''}
                    >
                      <div>
                        {isUser
                          ? 'Your Account'
                          : !currentStanding.userAddress
                          ? 'Wallet not connected'
                          : currentStanding.userAddress.slice(0, 7) +
                            '...' +
                            currentStanding.userAddress.slice(-7)}
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
                {!currentStanding.totalVolume ? (
                  '-'
                ) : (
                  <Display
                    data={divide(currentStanding.totalVolume, usdcDecimals)}
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
                {!currentStanding.totalPnl ||
                currentStanding.totalPnl === null ? (
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
                  data={currentStanding.totalTrades}
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
          return (
            <CellContent
              content={[
                <NetPnl currentStanding={currentStanding} tokens={tokens} />,
              ]}
            />
          );
        } catch (err) {
          return <div>Bug</div>;
        }

      case 5:
        return (
          <CellContent
            content={[
              <div className="flex items-center">
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
                                    `${token.toLowerCase()}NetPnl`
                                  ] as string,
                                  decimals[token]
                                )}
                                unit={token}
                                label={
                                  gte(
                                    currentStanding[
                                      `${token.toLowerCase()}NetPnl`
                                    ] as string,
                                    '0'
                                  )
                                    ? '+'
                                    : ''
                                }
                                className={`f15 !ml-auto ${
                                  gte(
                                    currentStanding[
                                      `${token.toLowerCase()}NetPnl`
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
      case 6:
        if (offSet === '0') {
          if (row + 1 > winners.length) {
            return LOOSERS_POINT_BY_INDEX[10 - loosers.length + row];
          } else {
            return GAINERS_POINT_BY_INDEX[row];
          }
        }
        return currentStanding.rewards;

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
    winners?.length && userData?.length && Number(userRank) !== skip + 1 ? (
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
          options={winners}
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
        widths={['auto']}
        className="mt-4 tab:mt-[0] tab:mb-6"
        bodyJSX={BodyFormatter}
        cols={DailyCols.length}
        rows={totalRows}
        headerJSX={HeaderFormatter}
        topDecorator={topDecorator}
        onRowClick={(idx) => {
          navigateToProfile(winners?.[idx].userAddress);
        }}
        count={count}
        activePage={activePage}
        onPageChange={(a, p) => {
          onpageChange(p);
        }}
        loading={!winners}
        error={<TableErrorMsg msg="No data found." onClick={() => {}} />}
      />
    </LeaderBoardTableStyles>
  );
};
