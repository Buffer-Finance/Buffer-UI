import React, { ReactNode, useMemo } from 'react';
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
import { usdcDecimals } from '../Incentivised';
import { Rank } from '../Components/Rank';
import { useNavigate } from 'react-router-dom';

export const DailyWebTable: React.FC<{
  res: ILeague[] | undefined;
  count: number;
  skip: number;
  onpageChange?: (page: number) => void;
  userData?: ILeague[] | undefined;
  nftWinners?: number;
  userRank: string;
}> = ({ res, skip, count, onpageChange, userData, nftWinners, userRank }) => {
  const { address: account } = useUserAccount();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1200;
  const navigate = useNavigate();

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
      'Absolute Net PnL',
    ];
  }, []);

  //this adds the user data to the top of the table

  const HeaderFormatter = (col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={DailyCols}
        firstColClassName={firstColPadding.head}
      />
    );
  };
  const standings = res;

  const BodyFormatter = (row: number, col: number, user) => {
    if (!standings) return <></>;
    let currentStanding = standings[row];
    if (user) {
      currentStanding = user;
    }
    const isUser = user;
    switch (col) {
      case 0:
        return (
          <Rank
            isUser={isUser}
            row={row}
            skip={skip}
            userRank={currentStanding.rank}
            firstColPadding={firstColPadding.body}
            nftWinners={nftWinners}
          />
        );
      case 1:
        return (
          <CellContent
            content={[
              <>
                {currentStanding.user === account ? (
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
              </>,
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
        // if (!currentStanding.netPnL || currentStanding.netPnL === null)
        // return <div>null</div>;
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
  // let userInTop10 = -1;
  // if (res?.length && !skip && account) {
  //   const foundIndex = res.findIndex(
  //     (r) => r.user.toLowerCase() == account.toLowerCase()
  //   );
  //   if (foundIndex !== -1) {
  //     userInTop10 = foundIndex + 1;
  //   }
  // }
  const topDecorator =
    standings?.length && userData?.length ? (
      // const topDecorator = false ? (
      <BufferTableRow onClick={console.log} className="highlight">
        {new Array(DailyCols.length).fill(9).map((_, i) => (
          <BufferTableCell onClick={console.log}>
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
          onpageChange={(e, p) => {
            // router.push({
            //   pathname: router.pathname,
            //   query: { ...router.query, page: p },
            // });

            onpageChange(p);
          }}
          nftWinners={nftWinners}
        />
      )}

      <BufferTable
        widths={['16%', '22%', '16%', '14%', '16%', '16%']}
        className="mt-4 tab:mt-[0] tab:mb-6"
        bodyJSX={BodyFormatter}
        cols={DailyCols.length}
        rows={standings?.length}
        headerJSX={HeaderFormatter}
        topDecorator={topDecorator}
        // highlightIndexs={userRank && userData && userRank !== 0 ? [0] : []}
        onRowClick={(idx) => {
          navigate(`/profile?user_address=${standings[idx].user}`);
        }}
        count={count}
        onPageChange={(a, p) => {
          // router.push({
          //   pathname: router.pathname,
          //   query: { ...router.query, page: p },
          // });
          onpageChange(p);
        }}
        loading={!standings}
        error={<TableErrorMsg msg="No data found." onClick={() => {}} />}
      />
    </LeaderBoardTableStyles>
  );
};
