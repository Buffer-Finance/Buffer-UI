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
import { weeklyTournamentConfig } from './config';
import TabSwitch from '@Views/Common/TabSwitch';
import BufferTab from '@Views/Common/BufferTab';
import FrontArrow from '@SVG/frontArrow';
import NumberTooltip from '@Views/Common/Tooltips';
import { useWeekOffset } from '../Hooks/useWeekoffset';
import { useWeeklyLeaderboardQuery } from '../Hooks/useWeeklyLeaderboardQuery';
import { getRewardTooltip, TimerBox } from '../Incentivised';
import { ChainSwitchDropdown } from '@Views/Dashboard';

export const ROWINAPAGE = 10;
export const TOTALWINNERS = 10;

export const Weekly = () => {
  const { activeChain, configContracts } = useActiveChain();
  const { week, nextTimeStamp } = useWeekOfTournament();
  const { data, totalTournamentData, loserUserRank, winnerUserRank } =
    useWeeklyLeaderboardQuery();
  const activePages = useAtomValue(readLeaderboardPageActivePageAtom);
  const totalPages = useAtomValue(readLeaderboardPageTotalPageAtom);
  const setTableActivePage = useSetAtom(updateLeaderboardActivePageAtom);
  const { offset, setOffset } = useWeekOffset();
  const [activeTab, setActiveTab] = useState(0);

  const configValue = weeklyTournamentConfig[activeChain.id];
  const midnightTimeStamp = nextTimeStamp / 1000;
  const launchTimeStamp = configValue.startTimestamp / 1000;
  const distance = getDistance(launchTimeStamp);
  const isTimerEnded = distance <= 0;
  const stopwatch = useStopWatch(midnightTimeStamp);
  const usdcDecimals = configContracts.tokens['USDC'].decimals;

  const skip = useMemo(
    () => ROWINAPAGE * (activePages.arbitrum - 1),
    [activePages.arbitrum]
  );
  const tableData = useMemo(() => {
    if (data && data.userStats) {
      return data.userStats.slice(skip, skip + ROWINAPAGE);
    } else return [];
  }, [data, skip]);
  const loserStats = useMemo(() => {
    if (data && data.loserStats) {
      return data.loserStats.slice(skip, skip + ROWINAPAGE);
    } else return [];
  }, [data, skip]);
  const rewardPool = useMemo(() => {
    if (week === null) return null;
    if (configValue.endDay !== undefined) {
      if (offset === null) {
        if (week >= configValue.endDay) return '0 USDC';
      } else {
        if (Number(offset) >= configValue.endDay) return '0 USDC';
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
            configValue.rewardFixedAmount,
            divide(
              multiply(
                configValue.poolPercent,
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

  useEffect(() => {
    setActivePageNumber(1);
  }, [activeTab]);

  const setActivePageNumber = (page: number) => {
    setTableActivePage({ arbitrum: page });
  };

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
              <div className="flex items-center gap-3">
                <div> Leaderboard </div>
                <ChainSwitchDropdown baseUrl="/leaderboard/weekly" />
              </div>
              <a
                className="whitespace-nowrap flex items-center text-buffer-blue text-f13 hover:underline"
                href={configValue.contestRules}
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
                    content={getRewardTooltip(
                      configValue.rewardFixedAmount,
                      configValue.poolPercent,
                      'USDC'
                    )}
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
          tablist={[{ name: 'Winners' }, { name: 'Losers' }]}
        />
        <TabSwitch
          value={activeTab}
          childComponents={[
            <DailyWebTable
              res={tableData}
              count={totalPages.arbitrum}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={configValue.winnersNFT}
              userRank={winnerUserRank}
              activePage={activePages.arbitrum}
            />,
            <DailyWebTable
              activePage={activePages.arbitrum}
              userRank={loserUserRank}
              res={loserStats}
              count={totalPages.arbitrum}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={configValue.losersNFT}
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
                configValue.endDay && week !== null
                  ? week >= configValue.endDay
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
