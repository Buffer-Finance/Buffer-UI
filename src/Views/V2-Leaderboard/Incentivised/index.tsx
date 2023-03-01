import { CHAIN_CONFIGS } from 'config';
import useStopWatch, { useTimer } from '@Hooks/Utilities/useStopWatch';
import { useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { numberWithCommas } from '@Utils/display';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
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
import { endDay, startTimestamp } from './config';
import TImerStyle from '@Views/Common/SocialMedia/TimerStyle';
import { social } from '@Views/Common/SocialMedia';
import TabSwitch from '@Views/Common/TabSwitch';
import BufferTab from '@Views/Common/BufferTab';
import FrontArrow from '@SVG/frontArrow';
import NumberTooltip from '@Views/Common/Tooltips';
import { useDayOffset } from '../Hooks/useDayOffset';

export const ROWINAPAGE = 10;
export const TOTALWINNERS = 10;
export const usdcDecimals = 6;

export const Incentivised = () => {
  const { activeChain } = useActiveChain();
  const { day, nextTimeStamp } = useDayOfTournament();
  console.log(day, 'day in incentivised');
  const activePages = useAtomValue(readLeaderboardPageActivePageAtom);
  const skip = useMemo(
    () => ROWINAPAGE * (activePages.arbitrum - 1),
    [activePages.arbitrum]
  );
  const { data, totalTournamentData } = useLeaderboardQuery();
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
  const { offset, setOffset } = useDayOffset();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActivePageNumber(1);
  }, [activeTab]);

  useEffect(() => {
    if (offset === null) {
      setOffset(day.toString());
    }
  }, [day]);

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
                href="https://buffer-finance.medium.com/trading-in-bear-market-buffer-daily-trading-competitions-f4f487c5ddd9"
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
                // desc={<Display data={500} unit={"USDC"}  precisionj/>}
                desc={
                  endDay[activeChain.id] && offset >= endDay[activeChain.id] ? (
                    '0 USDC'
                  ) : data &&
                    data.reward &&
                    data.reward[0] &&
                    data.reward[0].settlementFee ? (
                    <NumberTooltip
                      content={'5% of the fees collected for the day.'}
                    >
                      <div>
                        {toFixed(
                          divide(
                            multiply(
                              '5',
                              divide(
                                data.reward[0].settlementFee,
                                usdcDecimals
                              ) ?? '0'
                            ),
                            '100'
                          ) ?? '0',
                          0
                        ) + ' USDC'}
                      </div>
                    </NumberTooltip>
                  ) : (
                    'fetching...'
                  )
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
            </div>
          }
        />
        <BufferTab
          value={activeTab}
          handleChange={(e, t) => {
            setActiveTab(t);
          }}
          distance={5}
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
              nftWinners={0}
            />,
            <DailyWebTable
              res={loserStats}
              count={totalPages.arbitrum}
              onpageChange={setActivePageNumber}
              userData={data?.userData}
              skip={skip}
              nftWinners={1}
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
              state={endDay[activeChain.id] && day >= endDay[activeChain.id]}
              shouldAllowClose={false}
              body={
                <>
                  <img
                    src="/lightning.png"
                    alt="lightning"
                    className="mr-3 mt-2 h-[18px]"
                  />
                  The competition ended on 20th Feb 4pm UTC.
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
    timer.days && {
      name: 'Days',
      value: timer.days,
    },
    (timer.hours || timer.days) && {
      name: 'Hours',
      value: timer.hours,
    },
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
