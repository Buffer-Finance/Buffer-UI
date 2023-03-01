import { CHAIN_CONFIGS } from 'config';
import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { numberWithCommas } from '@Utils/display';
import { toFixed } from '@Utils/NumString';
import { add, divide, multiply } from '@Utils/NumString/stringArithmatics';
import { Col } from '@Views/Common/ConfirmationModal';
import { getDistance } from '@Utils/Staking/utils';
import { LeaderBoard } from '..';
import {
  readLeaderboardPageActivePageAtom,
  readLeaderboardPageTotalPageAtom,
  updateLeaderboardActivePageAtom,
} from '../atom';
import { ContestFilterDD } from '../Components/ContestFilterDD';
import { TopData } from '../Components/TopData';
import { DailyWebTable } from '../Daily/DailyWebTable';
import { DailyStyles } from '../Daily/stlye';
import { useWeekOfTournament } from '../Hooks/useWeekOfTournament';
import { Warning } from '@Views/Common/Notification/warning';
import { useActiveChain } from '@Hooks/useActiveChain';
import { endDay, startTimestamp } from './config';

import TabSwitch from '@Views/Common/TabSwitch';
import BufferTab from '@Views/Common/BufferTab';
import FrontArrow from '@SVG/frontArrow';
import NumberTooltip from '@Views/Common/Tooltips';
import { useWeekOffset } from '../Hooks/useWeekoffset';
import {
  IWinrate,
  useWeeklyLeaderboardQuery,
} from '../Hooks/useWeeklyLeaderboardQuery';
import { TimerBox } from '../Incentivised';
import { ILeague } from '../interfaces';

export const ROWINAPAGE = 10;
export const TOTALWINNERS = 10;
export const usdcDecimals = 6;

export const Weekly = () => {
  const { activeChain } = useActiveChain();
  const { week, nextTimeStamp } = useWeekOfTournament();
  const activePages = useAtomValue(readLeaderboardPageActivePageAtom);
  const skip = useMemo(
    () => ROWINAPAGE * (activePages.arbitrum - 1),
    [activePages.arbitrum]
  );
  const {
    data,
    totalTournamentData,
    loserUserRank,
    winnerUserRank,
    loserWinrateUserRank,
    winnerWinrateUserRank,
  } = useWeeklyLeaderboardQuery();

  const tableData = useMemo(() => {
    let res: {
      winnerPnl: ILeague[];
      loserPnl: ILeague[];
      winnerWinRate: IWinrate[];
      loserWinrate: IWinrate[];
    } = { winnerPnl: [], loserPnl: [], winnerWinRate: [], loserWinrate: [] };
    if (data && data.userStats) {
      res.winnerPnl = data.userStats.slice(skip, skip + ROWINAPAGE);
    }
    if (data && data.loserStats) {
      res.loserPnl = data.loserStats.slice(skip, skip + ROWINAPAGE);
    }
    if (data && data.winnerWinrate) {
      res.winnerWinRate = data.winnerWinrate.slice(skip, skip + ROWINAPAGE);
    }
    if (data && data.loserWinrate) {
      res.loserWinrate = data.loserWinrate.slice(skip, skip + ROWINAPAGE);
    }
    return res;
  }, [data, skip]);

  const totalPages = useAtomValue(readLeaderboardPageTotalPageAtom);

  const setTableActivePage = useSetAtom(updateLeaderboardActivePageAtom);

  const setActivePageNumber = (page: number) => {
    setTableActivePage({ arbitrum: page });
  };

  const midnightTimeStamp = nextTimeStamp / 1000;

  const launchTimeStamp = startTimestamp[activeChain.id] / 1000;
  const distance = getDistance(launchTimeStamp);
  const isTimerEnded = distance <= 0;
  const stopwatch = useStopWatch(midnightTimeStamp);
  const { offset, setOffset } = useWeekOffset();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActivePageNumber(1);
  }, [activeTab]);

  const rewardPool = useMemo(() => {
    if (week === null) return null;
    if (endDay[activeChain.id] !== undefined) {
      if (offset === null) {
        if (week >= endDay[activeChain.id]) return '0 USDC';
      } else {
        if (Number(offset) >= endDay[activeChain.id]) return '0 USDC';
      }
    } else if (
      data &&
      data.reward &&
      data.reward[0] &&
      data.reward[0].settlementFee
    )
      return (
        toFixed(
          add(
            '1000',
            divide(
              multiply(
                '5',
                divide(data.reward[0].settlementFee, usdcDecimals) ?? '0'
              ),
              '100'
            ) ?? '0'
          ),
          0
        ) + ' USDC'
      );
    else return 'fetching...';
  }, [activeChain, week, offset, data]);

  // useEffect(() => {
  //   if (
  //     (week !== null && offset === null) ||
  //     (offset !== null && week !== null && offset.toString() != week.toFixed())
  //   ) {
  //     setOffset(week.toString());
  //   }
  // }, [week, offset]);

  let content;
  if (!isTimerEnded) {
    content = (
      <TimerBox
        expiration={launchTimeStamp}
        className="mt-[5vh] m-auto"
        head={
          <span className="text-5  mb-[25px] text-f16">
            Contest will start in
          </span>
        }
      />
    );
  } else {
    content = (
      <div className="m-auto">
        <TopData
          pageImage={
            <img
              src={CHAIN_CONFIGS['TESTNET']['ARBITRUM'].img}
              alt=""
              className="w-[45px]"
            />
          }
          heading={
            <div className="flex flex-col items-start">
              {activeChain.name}
              <a
                className="whitespace-nowrap flex items-center text-buffer-blue text-f13 hover:underline"
                href="https://zinc-atlasaurus-c98.notion.site/Buffer-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52"
                target={'blank'}
              >
                Contest Rules <FrontArrow className="tml w-fit inline mt-2" />
              </a>
            </div>
          }
          DataCom={
            <div className="flex items-center justify-start my-6 sm:!w-full sm:flex-wrap sm:gap-y-5 whitespace-nowrap">
              <Col
                head={'Reward Pool'}
                desc={
                  <NumberTooltip
                    content={
                      '1000 USDC + 5% of the fees collected for the week.'
                    }
                  >
                    <div>{rewardPool}</div>
                  </NumberTooltip>
                }
                descClass="text-f16 tab:text-f14 font-medium light-blue-text "
                headClass="text-f14 tab:text-f12 fw5 text-6"
                className="winner-card"
              />
              <Col
                head={`Countdown ${week ? `(#${week})` : ''}`}
                desc={stopwatch}
                descClass="text-f16 tab:text-f14 fw4 text-5"
                headClass="text-f14 tab:text-f12 fw5 text-6"
                className="winner-card"
              />
              <Col
                head={'Trades'}
                desc={
                  totalTournamentData?.allTradesCount
                    ? totalTournamentData.allTradesCount
                    : 'Counting...'
                }
                descClass="text-f16 tab:text-f14 fw4 text-5 "
                headClass="text-f14 tab:text-f12 fw5 text-6"
                className="winner-card"
              />
              <Col
                head={'Volume'}
                desc={
                  data &&
                  data.reward &&
                  data.reward[0] &&
                  data.reward[0].totalFee
                    ? numberWithCommas(
                        toFixed(
                          divide(data.reward[0].totalFee, usdcDecimals) ?? '0',
                          0
                        )
                      ) + ' USDC'
                    : 'Counting...'
                }
                descClass="text-f16 tab:text-f14 fw4 "
                headClass="text-f14 tab:text-f12 fw5 text-6"
                className="winner-card"
              />
              <Col
                head={'Participants'}
                desc={
                  totalTournamentData?.totalUsers
                    ? totalTournamentData.totalUsers
                    : 'Counting...'
                }
                descClass="text-f16 tab:text-f14 fw4 text-5"
                headClass="text-f14 tab:text-f12 fw5 text-6"
                className="winner-card"
              />
              <Col
                head={'Week'}
                desc={
                  <ContestFilterDD
                    count={week ?? 0}
                    offset={offset}
                    setOffset={setOffset}
                  />
                }
                descClass="text-f16 tab:text-f14 fw4 text-5 "
                headClass="text-f14 tab:text-f12 fw5 text-6"
                className="winner-card"
              />
            </div>
          }
        />
        <BufferTab
          value={activeTab}
          handleChange={(e, t) => {
            setActiveTab(t);
          }}
          distance={5}
          tablist={[
            { name: 'Winners (by Pnl)' },
            { name: 'Losers (by Pnl)' },
            { name: 'Winners (by Win Rate)' },
            { name: 'Losers (by Win Rate)' },
          ]}
        />
        <TabSwitch
          value={activeTab}
          childComponents={[
            <DailyWebTable
              res={tableData.winnerPnl}
              count={totalPages.arbitrum}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={3}
              userRank={winnerUserRank}
              activePage={activePages.arbitrum}
            />,
            <DailyWebTable
              activePage={activePages.arbitrum}
              userRank={loserUserRank}
              res={tableData.loserPnl}
              count={totalPages.arbitrum}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={4}
            />,
            <DailyWebTable
              activePage={activePages.arbitrum}
              userRank={winnerWinrateUserRank}
              res={tableData.winnerWinRate}
              count={tableData.winnerWinRate.length}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={4}
              isWinrateTable
            />,
            <DailyWebTable
              activePage={activePages.arbitrum}
              userRank={loserWinrateUserRank}
              res={tableData.loserWinrate}
              count={tableData.loserWinrate.length}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={4}
              isWinrateTable
            />,
          ]}
        />
      </div>
    );
  }

  return (
    <LeaderBoard
      children={
        <DailyStyles>
          <div>
            <Warning
              closeWarning={() => {}}
              state={
                endDay[activeChain.id] && week !== null
                  ? week >= endDay[activeChain.id]
                  : false
              }
              shouldAllowClose={false}
              body={
                <>
                  <img
                    src="/lightning.png"
                    alt="lightning"
                    className="mr-3 mt-2 h-[18px]"
                  />
                  The competition ended on 20th Jan 4pm UTC.
                </>
              }
              className="!mb-3"
            />
            {content}
          </div>
        </DailyStyles>
      }
    ></LeaderBoard>
  );
};
