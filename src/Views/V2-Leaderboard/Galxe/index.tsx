import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useActiveChain } from '@Hooks/useActiveChain';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { getDistance } from '@Utils/Staking/utils';
import { numberWithCommas } from '@Utils/display';
import { Col } from '@Views/Common/ConfirmationModal';
import { Warning } from '@Views/Common/Notification/warning';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { LeaderBoard } from '..';
import { ContestFilterDD } from '../Components/ContestFilterDD';
import { TopData } from '../Components/TopData';
import { DailyWebTable } from '../Daily/DailyWebTable';
import { DailyStyles } from '../Daily/stlye';
import { useWeekOfTournament } from '../Hooks/useWeekOfTournament';
import {
  readLeaderboardPageActivePageAtom,
  updateLeaderboardActivePageAtom,
} from '../atom';
import { weeklyTournamentConfig } from './config';

import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import FrontArrow from '@SVG/frontArrow';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import BufferTab, { ITab } from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { IWinrate } from '../Hooks/useWeeklyLeaderboardQuery';
import { useWeekOffset } from '../Hooks/useWeekoffset';
import {
  TimerBox,
  descClass,
  getTournamentEndDateFromWeek,
  headClass,
} from '../Incentivised';
import { ILeague } from '../interfaces';
import { useGalxeLeaderboardQuery } from './useGalxeLeaderboardQuery';

export const ROWINAPAGE = 10;
export const TOTALWINNERS = 10;

const rewardPool = {
  2: 4975,
  3: 4808,
};
export const galxTaskLink =
  'https://app.galxe.com/quest/XZeZw9Mauqx5SQyn6uGAbs/GCiUithb4z';

const winnersAmount = {
  1: 1030.2,
  2: 515.1,
  3: 236.0875,
  4: 236.0875,
  5: 236.0875,
  6: 236.0875,
  7: 236.0875,
  8: 236.0875,
  9: 236.0875,
  10: 236.0875,
};

const loosersAmount = {
  1: 412.2,
  2: 206.1,
  3: 94.4625,
  4: 94.4625,
  5: 94.4625,
  6: 94.4625,
  7: 94.4625,
  8: 94.4625,
  9: 94.4625,
  10: 94.4625,
};

export const Galxe = () => {
  const { activeChain } = useActiveChain();
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'];
  const configValue = weeklyTournamentConfig[activeChain.id];
  const { week, nextTimeStamp } = useWeekOfTournament({
    startTimestamp: configValue.startTimestamp,
  });
  const {
    data,
    totalTournamentData,
    loserUserRank,
    winnerUserRank,
    // loserWinrateUserRank,
    // winnerWinrateUserRank,
  } = useGalxeLeaderboardQuery();
  const activePages = useAtomValue(readLeaderboardPageActivePageAtom);

  const skip = useMemo(
    () => ROWINAPAGE * (activePages.arbitrum - 1),
    [activePages.arbitrum]
  );

  const totalPages = useMemo(() => {
    const pages = {
      winnerPnl: 0,
      loserPnl: 0,
      winnerWinRate: 0,
      // loserWinRate: 0,
    };
    if (data) {
      if (data.userStats && data.userStats.length > 0) {
        pages.winnerPnl = Math.ceil(data.userStats.length / ROWINAPAGE);
      }
      if (data.loserStats && data.loserStats.length > 0) {
        pages.loserPnl = Math.ceil(data.loserStats.length / ROWINAPAGE);
      }
    }
    return pages;
  }, [data]);

  const tableData = useMemo(() => {
    const res: {
      winnerPnl: ILeague[];
      loserPnl: ILeague[];
      winnerWinRate: IWinrate[];
      // loserWinrate: IWinrate[];
    } = {
      winnerPnl: [],
      loserPnl: [],
      winnerWinRate: [],
      //  loserWinrate: []
    };
    if (data) {
      if (data.userStats) {
        res.winnerPnl = data.userStats.slice(skip, skip + ROWINAPAGE);
      }
      if (data.loserStats) {
        res.loserPnl = data.loserStats.slice(skip, skip + ROWINAPAGE);
      }
    }
    return res;
  }, [data, skip]);

  const setTableActivePage = useSetAtom(updateLeaderboardActivePageAtom);

  const setActivePageNumber = (page: number) => {
    setTableActivePage({ arbitrum: page });
  };

  const midnightTimeStamp = nextTimeStamp / 1000;

  const launchTimeStamp = configValue.startTimestamp / 1000;
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

  const tabList = useMemo(() => {
    const list = [
      { name: 'Winners' },
      { name: 'Losers' },
      // { name: 'Winners (by Win Rate)' },
      // { name: 'Losers (by Win Rate)' },
    ];
    if (configValue.winrateStartWeek) {
      if (offset !== null && configValue.winrateStartWeek > Number(offset))
        return list.slice(0, 2);
      else if (week !== null && configValue.winrateStartWeek > Number(week))
        return list.slice(0, 2);
    } else if (configValue.winrateStartWeek === undefined)
      return list.slice(0, 2);
    return list;
  }, [offset, activeChain]);

  const isCurrentWeekIsWeekTwo = useMemo(() => {
    if (week == 3) {
      if (offset == null) {
        return true;
      } else if (offset == '3') {
        return true;
      }
    }
    return false;
  }, [week, offset]);

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
      <>
        <div className="flex items-center justify-start my-6 sm:!w-full sm:flex-wrap sm:gap-y-5 whitespace-nowrap">
          <Col
            head={'Reward Pool'}
            desc={<div>${rewardPool[offset ?? week] ?? '2800'}</div>}
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={`Countdown ${week ? `(#${week})` : ''}`}
            desc={stopwatch}
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Trades'}
            desc={
              totalTournamentData !== null &&
              totalTournamentData.allTradesCount !== null &&
              totalTournamentData.allTradesCount !== undefined
                ? totalTournamentData.allTradesCount || 0
                : 0
            }
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Volume'}
            desc={
              data !== null &&
              data !== undefined &&
              data.reward !== null &&
              data.reward[0] !== null &&
              data.reward[0] !== undefined &&
              data.reward[0].totalFee !== null &&
              data.reward[0].totalFee !== undefined
                ? numberWithCommas(
                    toFixed(
                      divide(data.reward[0].totalFee, usdcDecimals) ?? '0',
                      0
                    )
                  ) + ' USDC'
                : 0
            }
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Participants'}
            desc={
              totalTournamentData !== null &&
              totalTournamentData !== undefined &&
              totalTournamentData.totalUsers !== null &&
              totalTournamentData.totalUsers !== undefined
                ? totalTournamentData.totalUsers
                : 0
            }
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />{' '}
          <Col
            head={'Week'}
            desc={
              <ContestFilterDD
                count={week ?? 0}
                offset={offset}
                setOffset={setOffset}
              />
            }
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
        </div>
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
                nftWinners={configValue.winnersNFT}
                userRank={winnerUserRank}
                activePage={activePages.arbitrum}
                isGalxTable
                isCurrentWeek={isCurrentWeekIsWeekTwo}
                priceAmount={winnersAmount}
              />,
              <DailyWebTable
                activePage={activePages.arbitrum}
                userRank={loserUserRank}
                standings={tableData.loserPnl}
                count={totalPages.loserPnl}
                onpageChange={setActivePageNumber}
                userData={data?.userData}
                skip={skip}
                nftWinners={configValue.losersNFT}
                isGalxTable
                isCurrentWeek={isCurrentWeekIsWeekTwo}
                priceAmount={loosersAmount}
              />,
              // <DailyWebTable
              //   activePage={activePages.arbitrum}
              //   userRank={winnerWinrateUserRank}
              //   standings={tableData.winnerWinRate}
              //   count={totalPages.winnerWinRate}
              //   onpageChange={setActivePageNumber}
              //   userData={data?.userData}
              //   skip={skip}
              //   nftWinners={configValue.winrateNFT}
              //   isWinrateTable
              // />,
              // <DailyWebTable
              //   activePage={activePages.arbitrum}
              //   userRank={loserWinrateUserRank}
              //   standings={tableData.loserWinrate}
              //   count={totalPages.loserWinRate}
              //   onpageChange={setActivePageNumber}
              //   userData={data?.userData}
              //   skip={skip}
              //   nftWinners={4}
              //   isWinrateTable
              // />,
            ]}
          />
        </div>
      </>
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
                configValue.endDay && week !== null
                  ? week >= configValue.endDay
                  : false
              }
              shouldAllowClose={false}
              body={
                <div className="flex gap-3 items-start">
                  <img
                    src="/lightning.png"
                    alt="lightning"
                    className="mr-3 mt-2 h-[18px]"
                  />
                  The competition ended on{' '}
                  {getTournamentEndDateFromWeek({
                    startTimestamp: configValue.startTimestamp,
                    endWeek: configValue.endDay,
                  })}{' '}
                  4pm UTC.
                </div>
              }
              className="!mb-3 text-f16"
            />
            {
              <div className="m-auto mb-7">
                <TopData
                  pageImage={
                    <></>
                    // <img
                    //   src={chainImageMappipng[activeChain.name]}
                    //   alt=""
                    //   className="w-[45px]"
                    // />
                  }
                  heading={
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div>Buffer Bull vs Bear Battles Leaderboard</div>
                        {/* <ChainSwitchDropdown baseUrl="/leaderboard/weekly" /> */}
                      </div>
                      <a
                        className="whitespace-nowrap flex items-center text-[#7F87A7] text-f16 hover:underline"
                        href={configValue.contestRules}
                        target={'blank'}
                      >
                        Contest Rules{' '}
                        <FrontArrow
                          className="ml-2 w-fit inline scale-125 mt-1"
                          arrowColor="#7F87A7"
                        />
                      </a>
                      <a
                        className="whitespace-nowrap flex items-center text-[#7F87A7] text-f16 hover:underline"
                        href={
                          'https://buffer-finance.deform.cc/bbb-trading-comp/'
                        }
                        target={'blank'}
                      >
                        Fill this form to receive rewards
                        <FrontArrow
                          className="ml-2 w-fit inline scale-125 mt-1"
                          arrowColor="#7F87A7"
                        />
                      </a>
                    </div>
                  }
                  DataCom={content}
                />
              </div>
            }
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
