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
import { Rank } from '@Views/V2-Leaderboard/Components/Rank';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { IWeeklyLeague } from '@Views/V2-Leaderboard/interfaces';
import { Launch } from '@mui/icons-material';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NetPnl } from '../NetPnl';
import { LeaderBoardTableStyles } from '@Views/V2-Leaderboard/Daily/style';
import { MobileTable } from './MobileTable';

export const WebTable: React.FC<{
  data: IWeeklyLeague[] | undefined;
  isWinnersTable: boolean;
}> = ({ data, isWinnersTable }) => {
  const { address: account } = useUserAccount();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1200;
  const navigate = useNavigate();
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'];
  const params = useParams();
  const poolNames = usePoolNames();

  const tokens = useMemo(
    () =>
      poolNames.filter(
        (pool) =>
          !pool.toLowerCase().includes('pol') &&
          !pool.toLowerCase().includes('.e')
      ),
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
      'Trades',
      'Net PnL (%)',
      'PnL',
      'Rewards',
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
  if (data) {
    totalRows = data.length;
  }
  const BodyFormatter = (row: number, col: number) => {
    if (!data) return <></>;
    const total = data;
    let currentStanding: IWeeklyLeague = total[row];
    const rank = row + 1;
    switch (col) {
      case 0:
        return (
          <Rank
            isUser={false}
            row={row}
            skip={0}
            userRank={rank}
            firstColPadding={firstColPadding.body}
            nftWinners={0}
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
                    <NumberTooltip content={currentStanding.userAddress || ''}>
                      <div>
                        {currentStanding.userAddress == account
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
                      tokens.length > 1 && (
                        <TableAligner
                          keysName={tokens}
                          keyStyle={tooltipKeyClasses}
                          valueStyle={tooltipValueClasses}
                          values={tokens.map(
                            (token) =>
                              toFixed(
                                divide(
                                  (currentStanding as any)[
                                    `${token.toUpperCase()}Volume`
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
                      tokens.length > 1 && (
                        <TableAligner
                          keysName={tokens}
                          keyStyle={tooltipKeyClasses}
                          valueStyle={tooltipValueClasses}
                          values={tokens.map(
                            (token) =>
                              (currentStanding as any)[
                                `${token.toUpperCase()}Trades`
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
                                    `${token.toUpperCase()}Pnl`
                                  ] as string,
                                  decimals[token]
                                )}
                                unit={token}
                                label={
                                  gte(
                                    (currentStanding as any)[
                                      `${token.toUpperCase()}Pnl`
                                    ] as string,
                                    '0'
                                  )
                                    ? '+'
                                    : ''
                                }
                                className={`f15 !ml-auto ${
                                  gte(
                                    (currentStanding as any)[
                                      `${token.toUpperCase()}Pnl`
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
        if (
          currentStanding.winPoints == null &&
          currentStanding.losePoints == null
        ) {
          return <RunningWeekRewardsChip />;
        }
        if (!isWinnersTable) {
          return (
            <Display
              data={currentStanding.loseRewards}
              precision={2}
              unit="ARB"
              className="!justify-start"
            />
          );
        } else {
          return (
            <Display
              data={currentStanding.winRewards}
              precision={2}
              unit="ARB"
              className="!justify-start"
            />
          );
        }

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

  return (
    <LeaderBoardTableStyles>
      {isMobile && <MobileTable options={data} onClick={navigateToProfile} />}

      <BufferTable
        widths={['auto']}
        className="mt-4 tab:mt-[0] tab:mb-6"
        bodyJSX={BodyFormatter}
        cols={DailyCols.length}
        rows={totalRows}
        headerJSX={HeaderFormatter}
        onRowClick={(idx) => {
          navigateToProfile(data?.[idx].userAddress);
        }}
        loading={!data}
        error={<TableErrorMsg msg="No data found." onClick={() => {}} />}
      />
    </LeaderBoardTableStyles>
  );
};
const RunningWeekRewardsChip = () => {
  return (
    <div>
      <NumberTooltip content={'Rewards will be assigned next week'}>
        <div>-</div>
      </NumberTooltip>
    </div>
  );
};
