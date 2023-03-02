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
  updateLeaderboardActivePageAtom,
} from '../atom';
import { ContestFilterDD } from '../Components/ContestFilterDD';
import { TopData } from '../Components/TopData';
import { DailyWebTable } from '../Daily/DailyWebTable';
import { DailyStyles } from '../Daily/stlye';
import { useWeekOfTournament } from '../Hooks/useWeekOfTournament';
import { Warning } from '@Views/Common/Notification/warning';
import { useActiveChain } from '@Hooks/useActiveChain';
import { endDay, startTimestamp, winRateStart } from './config';

import TabSwitch from '@Views/Common/TabSwitch';
import BufferTab, { ITab } from '@Views/Common/BufferTab';
import FrontArrow from '@SVG/frontArrow';
import NumberTooltip from '@Views/Common/Tooltips';
import { useWeekOffset } from '../Hooks/useWeekoffset';
import {
  IWinrate,
  useWeeklyLeaderboardQuery,
} from '../Hooks/useWeeklyLeaderboardQuery';
import { TimerBox } from '../Incentivised';
import { ILeague } from '../interfaces';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';

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

  const totalPages = useMemo(() => {
    const pages = {
      winnerPnl: 0,
      loserPnl: 0,
      winnerWinRate: 0,
      loserWinRate: 0,
    };
    if (data) {
      if (data.userStats && data.userStats.length > 0) {
        pages.winnerPnl = Math.ceil(data.userStats.length / ROWINAPAGE);
      }
      if (data.loserStats && data.loserStats.length > 0) {
        pages.loserPnl = Math.ceil(data.loserStats.length / ROWINAPAGE);
      }
      if (data.winnerWinrate && data.winnerWinrate.length > 0) {
        pages.winnerWinRate = Math.ceil(data.winnerWinrate.length / ROWINAPAGE);
      }
      if (data.loserWinrate && data.loserWinrate.length > 0) {
        pages.loserWinRate = Math.ceil(data.loserWinrate.length / ROWINAPAGE);
      }
    }
    return pages;
  }, [data]);

  const tableData = useMemo(() => {
    const res: {
      winnerPnl: ILeague[];
      loserPnl: ILeague[];
      winnerWinRate: IWinrate[];
      loserWinrate: IWinrate[];
    } = { winnerPnl: [], loserPnl: [], winnerWinRate: [], loserWinrate: [] };
    if (data) {
      if (data.userStats) {
        res.winnerPnl = data.userStats.slice(skip, skip + ROWINAPAGE);
      }
      if (data.loserStats) {
        res.loserPnl = data.loserStats.slice(skip, skip + ROWINAPAGE);
      }
      if (data.winnerWinrate) {
        res.winnerWinRate = data.winnerWinrate.slice(skip, skip + ROWINAPAGE);
      }
      if (data.loserWinrate) {
        res.loserWinrate = data.loserWinrate.slice(skip, skip + ROWINAPAGE);
      }
    }
    return res;
  }, [data, skip]);

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

  useEffect(() => {
    if (activeTab > tabList.length - 1) {
      setActiveTab(0);
    }
  }, [offset]);

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

  const tabList = useMemo(() => {
    const list = [
      { name: 'Winners (by Pnl)' },
      { name: 'Losers (by Pnl)' },
      { name: 'Winners (by Win Rate)' },
      { name: 'Losers (by Win Rate)' },
    ];
    if (winRateStart[activeChain.id])
      if (offset !== null && winRateStart[activeChain.id] > Number(offset))
        return list.slice(0, 2);
      else if (week !== null && winRateStart[activeChain.id] > Number(week))
        return list.slice(0, 2);
    return list;
  }, [offset, activeChain]);

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
        <div className="flex flex-col justify-center sm:max-w-[590px] m-auto">
          <LeaderBoardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabList={tabList}
          />
          <TabSwitch
            value={activeTab}
            childComponents={[
              <DailyWebTable
                standings={tableData.winnerPnl}
                count={totalPages.winnerPnl}
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
                standings={tableData.loserPnl}
                count={totalPages.loserPnl}
                onpageChange={setActivePageNumber}
                userData={data?.userData}
                skip={skip}
                nftWinners={4}
              />,
              <DailyWebTable
                activePage={activePages.arbitrum}
                userRank={winnerWinrateUserRank}
                standings={tableData.winnerWinRate}
                count={totalPages.winnerWinRate}
                onpageChange={setActivePageNumber}
                userData={data?.userData}
                skip={skip}
                nftWinners={4}
                isWinrateTable
              />,
              <DailyWebTable
                activePage={activePages.arbitrum}
                userRank={loserWinrateUserRank}
                standings={tableData.loserWinrate}
                count={totalPages.loserWinRate}
                onpageChange={setActivePageNumber}
                userData={data?.userData}
                skip={skip}
                nftWinners={4}
                isWinrateTable
              />,
            ]}
          />
        </div>
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

export const LeaderBoardTabs = ({
  activeTab,
  setActiveTab,
  tabList,
}: {
  activeTab: number;
  setActiveTab: (t: number) => void;
  tabList: ITab[];
}) => {
  if (window.innerWidth < 1200) {
    return (
      <BufferDropdown
        rootClass="w-[200px]"
        className="py-4 px-4 bg-2"
        dropdownBox={(a, open, disabled) => (
          <div className="flex items-center justify-between text-f15 bg-1 px-4 pt-2 pb-[6px] rounded-md">
            {tabList[activeTab].name}
            <DropdownArrow open={open} />
          </div>
        )}
        items={tabList}
        item={(tab, handleClose, onChange, isActive, index) => {
          return (
            <div
              className={`text-f14 whitespace-nowrap ${
                index === tabList.length - 1 ? '' : 'pb-[6px]'
              } ${index === 0 ? '' : 'pt-[6px]'} ${
                activeTab === index ? 'text-1' : 'text-2'
              }`}
              onClick={() => setActiveTab(index)}
            >
              {tab.name}
            </div>
          );
        }}
      />
    );
  } else
    return (
      <BufferTab
        value={activeTab}
        handleChange={(e, t) => {
          setActiveTab(t);
        }}
        tablist={tabList}
      />
    );
};
