import useStopWatch, { useTimer } from '@Hooks/Utilities/useStopWatch';
import { useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { numberWithCommas } from '@Utils/display';
import { toFixed } from '@Utils/NumString';
import { add, divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
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
import { useDayOfTournament } from '../Hooks/useDayOfTournament';
import { useLeaderboardQuery } from '../Hooks/useLeaderboardQuery';
import { Warning } from '@Views/Common/Notification/warning';
import { useActiveChain } from '@Hooks/useActiveChain';
import { DailyTournamentConfig } from './config';
import TImerStyle from '@Views/Common/SocialMedia/TimerStyle';
import { social } from '@Views/Common/SocialMedia';
import TabSwitch from '@Views/Common/TabSwitch';
import FrontArrow from '@SVG/frontArrow';
import NumberTooltip from '@Views/Common/Tooltips';
import { useDayOffset } from '../Hooks/useDayOffset';
import { LeaderBoardTabs } from '../Weekly';
import { ChainSwitchDropdown } from '@Views/Dashboard';
import { getDisplayDateUTC } from '@Utils/Dates/displayDateTime';

export const ROWINAPAGE = 10;
export const TOTALWINNERS = 10;

export const getRewardTooltip = (
  fixedAmount: string,
  poolPercent: string,
  unit: string
) => {
  let tooltip = '';
  if (gt(fixedAmount, '0')) {
    tooltip = tooltip + `${fixedAmount} ${unit} + `;
  }
  if (gt(poolPercent, '0'))
    tooltip = tooltip + `${poolPercent}% of the fees collected for the day.`;
  return tooltip;
};

export const getTournamentEndDateFromDay = ({
  startTimestamp,
  endDay,
}: {
  startTimestamp: number;
  endDay: number | undefined;
}) => {
  if (!startTimestamp || !endDay) return '';
  const startdate = getDisplayDateUTC(
    Math.floor(startTimestamp / 1000) + (endDay - 1) * 86400
  );

  return startdate;
};

export const getTournamentEndDateFromWeek = ({
  startTimestamp,
  endWeek,
}: {
  startTimestamp: number;
  endWeek: number | undefined;
}) => {
  if (!startTimestamp || !endWeek) return '';
  const startdate = getDisplayDateUTC(
    Math.floor(startTimestamp / 1000) + (endWeek - 1) * 604800
  );

  return startdate;
};

export const Incentivised = () => {
  const { activeChain, configContracts } = useActiveChain();
  const { day, nextTimeStamp } = useDayOfTournament();
  const activePages = useAtomValue(readLeaderboardPageActivePageAtom);
  const { data, totalTournamentData, loserUserRank, winnerUserRank } =
    useLeaderboardQuery();
  const totalPages = useAtomValue(readLeaderboardPageTotalPageAtom);
  const setTableActivePage = useSetAtom(updateLeaderboardActivePageAtom);
  const { offset, setOffset } = useDayOffset();
  const [activeTab, setActiveTab] = useState(0);

  const configValue = DailyTournamentConfig[activeChain.id];
  const launchTimeStamp = configValue.startTimestamp / 1000;
  const distance = getDistance(launchTimeStamp);
  const isTimerEnded = distance <= 0;
  const midnightTimeStamp = nextTimeStamp / 1000;
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
    if (configValue.endDay !== undefined) {
      if (offset === null) {
        if (day >= configValue.endDay) return '0 USDC';
      } else {
        if (Number(offset) >= configValue.endDay) return '0 USDC';
      }
    }
    if (data && data.reward && data.reward[0] && data.reward[0].settlementFee)
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
  }, [activeChain, day, offset, data]);

  useEffect(() => {
    setActivePageNumber(1);
  }, [activeTab, offset]);

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
      <>
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
            head={`Countdown ${day ? `(#${day})` : ''}`}
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
              data && data.reward && data.reward[0] && data.reward[0].totalFee
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
            head={'Day'}
            desc={
              <ContestFilterDD
                count={day}
                offset={offset}
                setOffset={setOffset}
              />
            }
            descClass="text-f16 tab:text-f14 fw4 text-5 "
            headClass="text-f14 tab:text-f12 fw5 text-6"
            className="winner-card"
          />
        </div>{' '}
        <div className="flex flex-col justify-center sm:max-w-[590px] m-auto">
          <LeaderBoardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabList={[{ name: 'Winners' }, { name: 'Losers' }]}
          />
          <TabSwitch
            value={activeTab}
            childComponents={[
              <DailyWebTable
                standings={tableData}
                count={totalPages.arbitrum}
                activePage={activePages.arbitrum}
                onpageChange={setActivePageNumber}
                userData={data?.userData}
                skip={skip}
                nftWinners={configValue.winnersNFT}
                userRank={winnerUserRank}
                isDailyTable
              />,
              <DailyWebTable
                standings={loserStats}
                count={totalPages.arbitrum}
                activePage={activePages.arbitrum}
                onpageChange={setActivePageNumber}
                userData={data?.userData}
                skip={skip}
                nftWinners={configValue.losersNFT}
                userRank={loserUserRank}
                isDailyTable
              />,
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
              state={configValue.endDay ? day >= configValue.endDay : false}
              shouldAllowClose={false}
              body={
                <>
                  <img
                    src="/lightning.png"
                    alt="lightning"
                    className="mr-3 mt-2 h-[18px]"
                  />
                  The competition ended on{' '}
                  {getTournamentEndDateFromDay({
                    startTimestamp: configValue.startTimestamp,
                    endDay: configValue.endDay,
                  })}{' '}
                  4pm UTC.
                </>
              }
              className="!mb-3"
            />
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
                      <div>Daily Leaderboard </div>
                      <ChainSwitchDropdown baseUrl="/leaderboard/daily" />
                    </div>
                    <a
                      className="whitespace-nowrap flex items-center text-buffer-blue text-f13 hover:underline"
                      href={configValue.contestRules}
                      target={'blank'}
                    >
                      Contest Rules <FrontArrow className="tml w-fit inline" />
                    </a>
                  </div>
                }
                DataCom={content}
              />
            </div>{' '}
          </div>
        </DailyStyles>
      }
    ></LeaderBoard>
  );
};

export function TimerBox({
  expiration,
  className,
  head,
}: {
  expiration: number;
  className?: string;
  head: ReactNode;
}) {
  const timer = useTimer(expiration);
  let arr = [
    timer.days
      ? {
          name: 'Days',
          value: timer.days,
        }
      : null,
    timer.hours || timer.days
      ? {
          name: 'Hours',
          value: timer.hours,
        }
      : null,
    {
      name: 'Minutes',
      value: timer.minutes,
    },
    {
      name: 'Seconds',
      value: timer.seconds,
    },
  ];
  arr = arr.filter((a) => a);

  return (
    <div
      className={
        'flex flex-col items-center w-fit  bg-1 p-[20px] rounded-[10px] px-[25px] ' +
        className
      }
    >
      {head}
      <div className="flex flex-row items-end text-f12">
        {arr.map((s, idx) => {
          if (s === null) return <></>;
          return (
            <>
              <div className="flex flex-col items-center">
                <div
                  className={
                    'text-3 text-f14 uppercase ' +
                    (idx < arr.length - 1 ? 'mr-[30%]' : '')
                  }
                >
                  {s.name}
                </div>
                <div className="text-buffer-blue text-[50px] mt-[-8px]">
                  {s.value.toString().padStart(2, '0')}
                  {idx < arr.length - 1 ? ':' : ''}
                </div>
              </div>
            </>
          );
        })}
      </div>
      <span className="text-f12 pb-4 ">Join to stay updated!</span>
      <TImerStyle>
        {social.map((social_link) => {
          return (
            <a
              className="social_link pointer flex items-center"
              target={'_blank'}
              href={social_link.link}
              key={social_link.name}
            >
              <img
                key={social_link.name}
                src={`/Social/Blue/${social_link.image}`}
                className="social_link_icon"
              />
            </a>
          );
        })}
      </TImerStyle>
    </div>
  );
}
