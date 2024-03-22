import React, { useEffect } from 'react';
import { DailyStyles } from './stlye';
import { Background } from '@Views/NFT/claimedNFT/style';
import { Col } from '@Views/Common/ConfirmationModal';
import DailyIcon from 'public/LeaderBoard/Daily';
import useSWR from 'swr';
import { Skeleton } from '@mui/material';
import { DailyWebTable } from './DailyWebTable';
import { getPageNumber, LeaderBoard } from '..';
import { ILeague, IPerformer } from '../interfaces';
import { atom, useAtom } from 'jotai';
import { getRes } from '@Utils/apis/api';
import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { serialize } from '@Views/Staking/utils';
import BufferDropdown from '@Views/Common/BufferDropdown';
import { createArray } from '@Utils/JSUtils/createArray';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGlobal } from 'Contexts/Global';
import { MAINNET_ENVS } from '@Config/index';
import { ContestFilterDD } from '../Components/ContestFilterDD';
import { TopData } from '../Components/TopData';

const DAILY_REWARD = `binary/reward/daily/`;
const DAILY_LEADERBOARD = `binary/leaderboard/?`;
const dailyData = atom<ILeague | null>(null);
const DAY_OFFSET = 0;

export const Daily = () => {
  const [dailyRes, setData] = useAtom(dailyData);
  const router = useRouter();
  const league = dailyRes;
  const { state } = useGlobal();
  const isPageAvailable = MAINNET_ENVS.includes(
    state.settings.activeChain?.env
  );

  useEffect(() => {
    getRes(DAILY_REWARD).then(([res]) => {
      setData(res);
    });
  }, [setData]);
  const { data: pastWeeklb } = useSWR<{
    options: IPerformer[];
    total_pages: number;
  }>(
    DAILY_LEADERBOARD +
      serialize({
        leaderboard_type: 'daily',
        day_offset: router.query.offset || 0,
        page: getPageNumber(router),
        limit: LEADERBOARD_LIMIT,
      })
  );

  const stopwatch = useStopWatch(league?.end_timestamp);
  return (
    <LeaderBoard>
      <DailyStyles>
        <DailyWebTable res={pastWeeklb} />
      </DailyStyles>
    </LeaderBoard>
  );
};

function WinnerCard({ className, rank, winner }) {
  return (
    <div className={`winner-card flex-col content-sbw ${className}`}>
      <div className="hf">
        <div className="f24 fw5 light-blue-text">#{rank}</div>
        <div className="f14 fw5 text-6">
          Given away to the trader with the top Relative P&L
        </div>
      </div>
      <Col
        head={'Held By'}
        desc={winner ? winner : 'No Winner Yet.'}
        headClass="f14 fw4 text-6"
        descClass="f14 fw4 text-1"
        className="items-start "
      />
    </div>
  );
}

function NFTImage({ className, type }) {
  return (
    <Background className={`mt0 mb0 ${className}`}>
      <div className="image mt0">
        <img src={`/NFTS/${type}_background.png`} className={`background`} />
        <img
          src={`/NFTS/${type}_foreground.png`}
          className={`${type} foreground`}
        />
        <img src="/trade.svg" className="trade" />
      </div>
    </Background>
  );
}

export const LEADERBOARD_LIMIT = 15;
