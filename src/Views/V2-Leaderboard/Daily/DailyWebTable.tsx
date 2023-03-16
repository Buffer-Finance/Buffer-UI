import React, { useMemo } from 'react';
import BufferTable, {
  BufferTableCell,
  BufferTableRow,
} from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { ILeague } from '../interfaces';
import { LeaderBoardTableStyles } from './stlye';
import { DailyMobileTable } from './DailyMobileTable';
import { useUserAccount } from '@Hooks/useUserAccount';
import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { Rank } from '../Components/Rank';
import { useNavigate } from 'react-router-dom';
import { Launch } from '@mui/icons-material';
import { IWinrate } from '../Hooks/useWeeklyLeaderboardQuery';
import { useActiveChain } from '@Hooks/useActiveChain';

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
}) => {
  const { address: account } = useUserAccount();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1200;
  const navigate = useNavigate();
  const { configContracts } = useActiveChain();
  const usdcDecimals = configContracts.tokens['USDC'].decimals;

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
      isWinrateTable ? 'Win Rate' : 'Absolute Net PnL',
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
                {!currentStanding.netPnL || currentStanding.netPnL === null
                  ? '-'
                  : currentStanding.totalTrades}
              </div>,
            ]}
          />
        );

      case 4:
        if (isWinrateTable && 'tradesWon' in currentStanding) {
          return (
            <CellContent content={[<div>{currentStanding.tradesWon}</div>]} />
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
                      className={`f15 ${!isNeg ? 'green' : 'red'}`}
                      unit={'%'}
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
              content={[<div>{divide(currentStanding.winRate, 3)}%</div>]}
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
                    label={gt(currentStanding.netPnL, '0') ? '+' : ''}
                    className={`f15 ${
                      gt(currentStanding.netPnL, '0') ? 'green' : 'red'
                    }`}
                    unit={'USDC'}
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
    if (address === undefined) return;
    navigate(`/profile?user_address=${address}`);
  };

  const topDecorator =
    standings?.length && userData?.length && Number(userRank) !== skip + 1 ? (
      <BufferTableRow onClick={console.log} className="highlight group ">
        {new Array(DailyCols.length).fill(9).map((_, i) => (
          <BufferTableCell onClick={() => navigateToProfile(account)}>
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
