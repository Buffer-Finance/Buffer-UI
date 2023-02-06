import React, { ReactNode, useEffect, useMemo } from 'react';
import { WeeklyBackground } from './style';
import Moneybag from 'src/SVG/Elements/Moneybag';
import { Col } from '@Views/Common/ConfirmationModal';
import useSWR from 'swr';
import { ILeague, IPerformer } from '../interfaces';
import { serialize } from '@Views/Staking/utils';
import { useGlobal } from 'Contexts/Global';
import { Display } from '@Views/Common/Tooltips/Display';
import { Skeleton } from '@mui/material';
import { getPageNumber, LeaderBoard } from '..';
import { TEMP_IMG } from 'pages/_app';
import { DailyWebTable } from '../Daily/DailyWebTable';
import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useRouter } from 'next/router';
import { getRes } from '@Utils/apis/api';
import { atom, useAtom } from 'jotai';
import { ContestFilterDD, LEADERBOARD_LIMIT } from '../Daily';
import { MAINNET_ENVS } from '@Config/index';
import { useAccount } from 'wagmi';

const BorderyCols = ({ cols, className }: { cols; className?: string }) => {
  return (
    <div
      className={`flex pt19 pb15 bg-1 fit-content m-border-radius ${className}`}
    >
      {cols.map((s) => (
        <div className="col-borders">{s}</div>
      ))}
    </div>
  );
};
const showDialog = atom<boolean>(false);

const WEEKLY_REWARD = `binary/reward/weekly/`;
const WEEKLY_LEADERBOARD = `binary/leaderboard/`;
const weeklyData = atom<ILeague | null>(null);

const leagueTable = {
  diamond: {
    name: 'Diamond',
    img: '/Diamond.png',
  },
  platinum: {
    name: 'Platinum',
    img: '/Platinum.png',
  },
  gold: {
    name: 'Gold',
    img: '/Gold.png',
  },
  bronze: {
    name: 'Bronze',
    img: '/Bronze.png',
  },
  silver: {
    name: 'Silver',
    img: '/Silver.png',
  },
};

BorderyCols.KeyValue = ({
  head,
  desc,
  className,
}: {
  head: ReactNode;
  desc: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={` pl22 pr22 ${className ? className : 'pl17 pr17'} text-f15`}
    >
      <div className="flex content-center text-3 mb5">{head}</div>
      <div className="light-blue-text text-f16 flex content-center">{desc}</div>
    </div>
  );
};

export const Weekly = () => {
  const [data, setData] = useAtom(weeklyData);
  const [dialog, setDialog] = useAtom(showDialog);
  const router = useRouter();
  const { state } = useGlobal();
  const isPageAvailable = MAINNET_ENVS.includes(
    state.settings.activeChain?.env
  );

  const league: { name: string; img: string } = useMemo(() => {
    let league = leagueTable['diamond'];
    if (router.query.league) {
      league = leagueTable[(router.query.league as string).toLowerCase()];
    }
    return league;
  }, [router.query.league]);
  const { data: currenWekklb } = useSWR<{
    options: IPerformer[];
    total_pages: number;
  }>(
    league &&
      WEEKLY_LEADERBOARD +
        league.name +
        '/?' +
        serialize({
          week_offset: router.query.offset || 0,
          page: getPageNumber(router),
          limit: LEADERBOARD_LIMIT,
        })
  );
  useEffect(() => {
    getRes(WEEKLY_REWARD + '?' + serialize({ league: league.name })).then(
      ([res]) => {
        setData(res);
      }
    );
  }, [league]);

  const { data: pastWeeklb } = useSWR<{
    options: IPerformer[];
    total_pages: number;
  }>(
    league &&
      WEEKLY_LEADERBOARD +
        league.name +
        '/?' +
        serialize({
          week_offset: '1',
          page: getPageNumber(router),
          limit: LEADERBOARD_LIMIT,
        })
  );

  const MinimumRequirementsUI = data && [
    {
      key: 'Min. trades',
      value: <Display data={data.league_eligibility.min_trade} label="" />,
    },
    {
      key: 'Min. volume',
      value: <Display data={data.league_eligibility.min_volume} label="$" />,
    },
    {
      key: 'iBFR Balance',
      value: (
        <Display data={data.league_eligibility.min_ibfr_balance} unit="iBFR" />
      ),
    },
  ];
  return (
    <LeaderBoard>
      <WeeklyBackground>
        <TopData weekly league={league} />
        {isPageAvailable && (
          <>
            <div className="text-f14 text-white flex items-center mt-[25px] mb-[10px] text-5">
              <span className="text-6 ml-[20px]">Required for</span> &nbsp;
              <img
                src={`/LeaderBoard/${league.img}`}
                className="league-logo"
              ></img>
              &nbsp;{league.name}&nbsp; League
            </div>
            <div className="flex items-end mb20 justify-between">
              <div className="flex items-center">
                {data ? (
                  <BorderyCols
                    cols={MinimumRequirementsUI.map((s) => (
                      <BorderyCols.KeyValue
                        key={s.key}
                        head={s.key}
                        desc={s.value}
                        className="hover:brightness-125"
                      />
                    ))}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    className=" season-skel lc extra-wide"
                  />
                )}
                {/* {league.name !== "Bronze" && (
              <>
                <div className="light-blue-text text-f15 w500 mr-3 ml10">
                  OR
                </div>
                <BorderyCols
                  cols={[
                    {
                      key: "User holds",
                      value: (
                        <div className="flex items-center">
                          <img
                            className="league-logo-sm"
                            src={`/LeaderBoard/${league.img}`}
                          ></img>
                          &nbsp;{league.name} NFT
                        </div>
                      ),
                    },
                  ].map((s) => (
                    <BorderyCols.KeyValue
                      head={s.key}
                      desc={s.value}
                      className="hover:brightness-125"
                    />
                  ))}
                />
              </>
            )} */}
              </div>
              {data && (
                <div className="flex filter-dd mr5 items-center mt20">
                  Week &nbsp;
                  <ContestFilterDD dailyRes={data} />{' '}
                </div>
              )}{' '}
            </div>
            {/* 
        {pastWeeklb && pastWeeklb.options.length ? (
          <BorderyCols
            className="pt42 pb34 sm-width-none"
            cols={pastWeeklb.options.map((s, index) => (
              <RewardHolder key={index} data={s} />
            ))}
          />
        ) : null} */}
          </>
        )}

        {currenWekklb ? (
          <DailyWebTable res={currenWekklb} />
        ) : (
          <Skeleton variant="rectangular" className=" season-skel lc xl" />
        )}
      </WeeklyBackground>
      <div className={`dialog ${dialog ? 'fade-in' : 'fade-out'}`}></div>
    </LeaderBoard>
  );
};

function TopData({ weekly, league }) {
  const { state } = useGlobal();
  const [dialog, setDialog] = useAtom(showDialog);
  const [data, setData] = useAtom(weeklyData);
  const timerString = useStopWatch(data?.end_timestamp);
  const isPageAvailable = state.settings.activeChain?.name === 'POLYGON';

  return (
    <div className="top-flex full-width mt-6">
      <div className="flex items-center">
        {weekly ? (
          <img src={`/LeaderBoard/${league.img}`} className="league-img"></img>
        ) : (
          <Moneybag />
        )}
        <div className="flex flex-col ml14">
          <p className="text-f22 text-5">{weekly ? league.name : 'Daily'}</p>
          <p className="text-f16 fw5 text-6">
            {weekly
              ? data?.description
              : 'Daily rewards based on daily trades.'}
            {/* <span
              className="flex learn-more ml6"
              onClick={() => {
                window.open(
                  "https://docs.umaproject.org/products/KPI-options#:~:text=Key%20Performance%20Indicator%20(KPI)%20options,option%20will%20be%20worth%20more",
                  "_blank"
                );
              }}
            >
              Learn more
              <FrontArrow className="tml" />
            </span> */}
          </p>
        </div>
      </div>
      <div className="flex-center">
        {weekly ? (
          data ? (
            isPageAvailable && (
              <>
                <Col
                  head={'Week'}
                  desc={data.league_week_count}
                  descClass="text-f20 fw4 text-5"
                  headClass="text-f14 text-6"
                  className="winner-card  pl18 pr18"
                />
                <Col
                  head={'Reward'}
                  desc={data.reward.amount + ' ' + data.reward.currency}
                  descClass="text-f20 fw4 light-blue-text"
                  headClass="text-f14 fw5 text-6"
                  className="winner-card  pr20 pl20"
                />
                <Col
                  head={'Participants'}
                  desc={data.participant_count}
                  descClass="text-f20 fw4 text-5"
                  headClass="text-f14 fw5 text-6"
                  className="winner-card  pl18 pr18"
                />
                <Col
                  head={'Countdown'}
                  desc={timerString}
                  descClass="text-f20 fw4 text-5"
                  headClass="text-f14 fw5 text-6"
                  className="pr18 pl18"
                />
              </>
            )
          ) : (
            <Skeleton variant="rectangular" className=" season-skel lc" />
          )
        ) : (
          <Col
            head={'Rank'}
            desc={'-'}
            descClass="f20 fw4"
            headClass="f14 fw5 text-6"
            className="winner-card pr18"
          />
        )}
      </div>

      {/* {data ? (
        <div className="mobile-info">
          <div className="flex-sbw full-width pb10">
            <Col
              head={"Countdown"}
              desc={timerString.substring(0, timerString.indexOf("m") + 1)}
              descClass="f20 fw4"
              headClass="f14 fw5 text-6"
              className="row-league"
            />
            <Col
              head={"Week"}
              desc={data.league_count}
              descClass="f20 fw4"
              headClass="f14 fw5 text-6"
              className="row-league b"
            />
          </div>
          <div className="flex-sbw full-width bt pt10">
            <Col
              head={"Season"}
              desc={data.pariticipant_count}
              descClass="f20 fw4"
              headClass="f14 fw5 text-6"
              className="row-league"
            />
            <Col
              head={
                <div className="flex items-center">
                  Requirement for{" "}
                  <IconButton
                    className="nil-p ml5"
                    onClick={() => setDialog(true)}
                  >
                    <IIconsm className="" />
                  </IconButton>
                </div>
              }
              desc={data.league_count}
              descClass="f20 fw4"
              headClass="f14 fw5 text-6"
              className="row-league b"
            />
          </div>
        </div>
      ) : (
        "Loading..."
      )} */}
    </div>
  );
}
