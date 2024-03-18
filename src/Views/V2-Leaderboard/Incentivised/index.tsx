import useStopWatch, { useTimer } from '@Hooks/Utilities/useStopWatch';
import { useActiveChain } from '@Hooks/useActiveChain';
import FrontArrow from '@SVG/frontArrow';
import { getDisplayDateUTC } from '@Utils/Dates/displayDateTime';
import { gt, subtract } from '@Utils/NumString/stringArithmatics';
import { getDistance } from '@Utils/Staking/utils';
import { Col } from '@Views/Common/ConfirmationModal';
import { Warning } from '@Views/Common/Notification/warning';
import { social } from '@Views/Common/SocialMedia';
import TImerStyle from '@Views/Common/SocialMedia/TimerStyle';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useSetAtom } from 'jotai';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { LeaderBoard } from '..';
import { League } from '../Components/BarData';
import { ContestFilterDD } from '../Components/ContestFilterDD';
import { TopData } from '../Components/TopData';
import { DailyWebTable } from '../Daily/DailyWebTable';
import { DailyStyles } from '../Daily/style';
import { useDayOfTournament } from '../Hooks/useDayOfTournament';
import { useDayOffset } from '../Hooks/useDayOffset';
import { LeaderBoardTabs } from '../Weekly';
import { updateLeaderboardActivePageAtom } from '../atom';
import { Participants, TotalTrades, TotalVolume } from './Components';
import { DailyTournamentConfig } from './config';
import { getDayId, useDailyLeaderboardData } from './useDailyLeaderBoardData';

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

export const headClass = 'text-f14 tab:text-f12 fw5 text-[#7F87A7]';
export const descClass = 'text-f16 tab:text-f14 fw4 text-[#C3C2D4]';

export const Incentivised = () => {
  const { activeChain } = useActiveChain();
  const { day, nextTimeStamp } = useDayOfTournament();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { name: 'Bronze' },
    { name: 'Silver' },
    { name: 'Gold' },
    { name: 'Platinum' },
    { name: 'Diamond' },
  ];
  const { data } = useDailyLeaderboardData(tabs[activeTab].name);
  const setTableActivePage = useSetAtom(updateLeaderboardActivePageAtom);
  const { offset, setOffset } = useDayOffset();

  const configValue = DailyTournamentConfig[activeChain.id];
  const launchTimeStamp = configValue.startTimestamp / 1000;
  const distance = getDistance(launchTimeStamp);
  const isTimerEnded = distance <= 0;
  const midnightTimeStamp = nextTimeStamp / 1000;
  const stopwatch = useStopWatch(midnightTimeStamp);
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'];
  const config = getConfig(activeChain.id);

  useEffect(() => {
    setActivePageNumber(1);
  }, [activeTab, offset]);

  const setActivePageNumber = (page: number) => {
    setTableActivePage({ arbitrum: page });
  };

  const totalCount = useMemo(() => {
    if (data === undefined) return 0;
    let totalParticipants = 0;
    if (typeof data.total_count === 'number')
      totalParticipants = data.total_count;
    else {
      totalParticipants = data.total_count.length;
    }

    if (totalParticipants === undefined) {
      if (data.winners !== undefined && data.loosers !== undefined) {
        totalParticipants = data.winners.length + data.loosers.length;
      } else if (data.winners !== undefined && data.loosers === undefined) {
        totalParticipants = data.winners.length;
      } else if (data.winners === undefined && data.loosers !== undefined) {
        totalParticipants = data.loosers.length;
      }
    }
    return totalParticipants;
  }, [data]);

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
          {/* <Col
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
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          /> */}
          <Col
            head={`Countdown ${day ? `(#${day})` : ''}`}
            desc={stopwatch}
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Trades'}
            desc={
              <TotalTrades
                dayId={getDayId(Number(day - Number(offset ?? day)))}
                graphUrl={config.graph.MAIN}
              />
            }
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Volume'}
            desc={
              <TotalVolume
                dayId={getDayId(Number(day - Number(offset ?? day)))}
                graphUrl={config.graph.MAIN}
              />
            }
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Participants'}
            desc={<Participants data={data} />}
            descClass={descClass}
            headClass={headClass}
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
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
          <Col
            head={'Your League'}
            desc={<League weekId={0} graphUrl={config.graph.MAIN} />}
            descClass={descClass}
            headClass={headClass}
            className="winner-card"
          />
        </div>{' '}
        <div className="flex flex-col justify-center b1200:items-center b1200:max-w-[590px] m-auto">
          <LeaderBoardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabList={tabs}
          />
          {/* <TabSwitch
            value={activeTab}
            className="pt-4"
            childComponents={
              [
                // <>
                //   <Winners winners={loserStats.winners} />
                //   <DailyWebTable
                //     standings={loserStats.others}
                //     count={totalPages.arbitrum}
                //     activePage={activePages.arbitrum}
                //     onpageChange={setActivePageNumber}
                //     userData={data?.userData}
                //     skip={skip}
                //     nftWinners={configValue.losersNFT}
                //     userRank={loserUserRank}
                //     // isDailyTable
                //   />
                // </>,
              ]
            }
          /> */}
          <div className="pt-4">
            {/* <Winners winners={tableData.winners} /> */}

            <DailyWebTable
              winners={data?.winners}
              loosers={data?.loosers}
              total_count={totalCount}
              count={1}
              activePage={1}
              onpageChange={setActivePageNumber}
              userData={undefined}
              skip={0}
              nftWinners={configValue.winnersNFT}
              userRank={'0'}
              offSet={offset ? subtract(day.toString(), offset) : '0'}
              // isDailyTable
            />
          </div>
          ,
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
                <div className="flex gap-3 items-start">
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
                </div>
              }
              className="!mb-3 text-f16"
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
                      {/* <ChainSwitchDropdown baseUrl="/leaderboard/daily" /> */}
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
