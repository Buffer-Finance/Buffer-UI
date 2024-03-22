import { add, divide, toFixed } from '@Utils/NumString/stringArithmatics';
import {
  getTimestampFromWeekId,
  getWeekId,
} from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import styled from '@emotion/styled';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { useCompetitionRewardsAlloted } from '../Hooks/useCompetitionRewardsAlloted';
import { useCompetitionRewardsClaimed } from '../Hooks/useCompetitionRewardsClaimed';
import { useRebatesAlloted } from '../Hooks/useRebatesAlloted';
import { useRebatesClaimed } from '../Hooks/useRebatesClaimed';
import { startWeekId } from '../config';

export const Seasons: React.FC<{
  selectedSeason: number;
  setSelectedSeason: (newSeason: number) => void;
}> = ({ selectedSeason, setSelectedSeason }) => {
  return (
    <div className="w-[325px] bg-[#141823] rounded-md sm:w-full">
      <div className="text-f20 font-medium text-[#F7F7F7] m-auto w-fit pt-5 mb-3">
        All Seasons
      </div>
      <TimeLine
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
      />
    </div>
  );
};

const TimeLine: React.FC<{
  selectedSeason: number;
  setSelectedSeason: (newSeason: number) => void;
}> = ({ selectedSeason, setSelectedSeason }) => {
  return (
    <BufferTimeline
      position="alternate"
      className="max-h-[450px] overflow-auto"
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((seasonNumber) => {
        const currentSeason = seasonNumber + 1;
        return (
          <BufferLineItem key={currentSeason}>
            <TimelineSeparator>
              <BufferConnector />
              <BufferDot
                isSelected={selectedSeason === currentSeason}
                isRightSelected={selectedSeason % 2 === 0}
              />
            </TimelineSeparator>
            <BufferContent>
              <Season
                isSelected={selectedSeason === currentSeason}
                seasonNum={currentSeason}
                onClick={setSelectedSeason}
              />
            </BufferContent>
          </BufferLineItem>
        );
      })}

      <BufferLineItem>
        <TimelineSeparator>
          <BufferConnector />
          {/* <BufferDot /> */}
        </TimelineSeparator>
        <BufferContent> </BufferContent>
      </BufferLineItem>
    </BufferTimeline>
  );
};

const BufferTimeline = styled(Timeline)`
  max-height: 485px;
  overflow: auto;

  ::-webkit-scrollbar {
    background: var(--bg-grey);
    height: 1px;
    width: 2px;
  }
`;

const BufferLineItem = styled(TimelineItem)`
  /* padding: 0 20px; */
  min-height: auto;
  display: flex;
  position: relative;

  ::before {
    padding: 0 20px;
  }

  :last-child {
    ::before {
      padding: 12px 20px;
    }
  }
`;

const BufferConnector = () => {
  return <TimelineConnector sx={{ backgroundColor: '#2C2C41', width: 4 }} />;
};

const BufferContent: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  return (
    <TimelineContent sx={{ p: '0 20px' }}>{props.children}</TimelineContent>
  );
};

const BufferDot: React.FC<{
  isSelected: boolean;
  isRightSelected: boolean;
}> = ({ isSelected, isRightSelected }) => {
  if (isSelected)
    return (
      <div className="relative">
        <TimelineDot
          sx={{
            margin: 0,
            borderColor: '#3772FF',
            backgroundColor: '#FFFFFF',
            borderWidth: '4px',
            padding: '3px',
          }}
          variant="outlined"
        />
        <img
          src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/Rewards/BlueArrow.svg`}
          alt="arrow"
          className={`scale-125 absolute bottom-[3px] ${
            isRightSelected ? 'right-[17px]' : 'left-[17px] rotate-180'
          }`}
        />
      </div>
    );
  return <TimelineDot sx={{ backgroundColor: '#464660', margin: 0 }} />;
};

const Season: React.FC<{
  seasonNum: number;
  onClick: (newSeason: number) => void;
  isSelected: boolean;
}> = ({ seasonNum, onClick, isSelected }) => {
  const liveSeasonId = getWeekId(0);
  const selectedSeasonId = startWeekId + seasonNum - 1;
  const selectedWeekStartDate = new Date(
    getTimestampFromWeekId(selectedSeasonId) * 1000
  );
  const isFutureSeason = selectedSeasonId > liveSeasonId;
  const { data: rebatesAlloted } = useRebatesAlloted();
  const {
    data: competitionRewardsAlloted,
    isValidating: isCompetitionRewardsLaoding,
  } = useCompetitionRewardsAlloted();
  const { data: rebatesClaimed, isValidating: isRebateClaimedLoading } =
    useRebatesClaimed();
  const {
    data: competitionRewardsClaimed,
    isValidating: isCompetitionRewardsClaimedLoading,
  } = useCompetitionRewardsClaimed();
  const weekId = startWeekId + seasonNum - 1;
  const currentWeekId = getWeekId(0);

  const competitionReward = useMemo(() => {
    if (competitionRewardsAlloted !== undefined) {
      const competitionRewards = competitionRewardsAlloted.find(
        (reward) => reward.weekId === weekId
      );
      let reward = '0';
      if (competitionRewards !== undefined) {
        reward = competitionRewards.amount;
      }
      return reward;
    }
    return '0';
  }, [competitionRewardsAlloted]);
  const rebate = useMemo(() => {
    if (rebatesAlloted !== undefined) {
      const rebates = rebatesAlloted[weekId]?.[0];
      let reward = '0';

      if (rebates !== undefined) {
        reward = rebates;
      }

      return reward;
    }
    return '0';
  }, [rebatesAlloted]);

  const rewardAmount = add(competitionReward, rebate);

  const isRewardClaimed = useMemo(() => {
    if (
      competitionRewardsAlloted !== undefined &&
      rebatesClaimed !== undefined &&
      competitionRewardsClaimed
    ) {
      const competitionRewards = competitionRewardsAlloted.find(
        (reward) => reward.weekId === weekId
      );

      let isCompetitionRewardsClaimed = false;
      if (competitionReward == '0') {
        isCompetitionRewardsClaimed = true;
      } else if (competitionRewards !== undefined) {
        isCompetitionRewardsClaimed = competitionRewardsClaimed.some(
          (r) => r.reward_id == competitionRewards.reward_id
        );
      }

      const isRebatesClaimed =
        rebate == '0' ||
        rebatesClaimed.some((r) => r.weekId == weekId.toString());
      console.log(rebate, isCompetitionRewardsClaimed, 'rebate');

      return isRebatesClaimed && isCompetitionRewardsClaimed;
    }
    return false;
  }, [rebatesClaimed, competitionRewardsClaimed]);

  function handleSeasonCLick() {
    onClick(seasonNum);
  }

  const isLoading =
    rebatesAlloted === undefined ||
    isCompetitionRewardsLaoding ||
    isRebateClaimedLoading ||
    isCompetitionRewardsClaimedLoading;

  return (
    <button
      className={`px-[9px] pt-[4px] pb-[7px] ${
        isSelected ? 'bg-[#3772FF] scale-110' : 'bg-[#2C2C41]'
      } rounded-md flex items-end justify-between w-full min-h-[48px] ${
        isFutureSeason ? 'opacity-30' : ''
      }`}
      onClick={handleSeasonCLick}
    >
      <div className="self-start">
        <div
          className={`text-f12 font-medium text-left  ${
            isSelected ? 'text-[#ffffff]' : 'text-[#C3C2D4]'
          }`}
        >
          Season {seasonNum}
        </div>
        {currentWeekId < weekId ? (
          <span className="text-f12 text-[#ffffff]">
            {selectedWeekStartDate.toLocaleDateString()}
          </span>
        ) : currentWeekId == weekId ? (
          <span
            className={`text-f14 font-medium ${
              isSelected ? 'text-[#ffffff]' : 'text-[#EBEBEB]'
            } text-left leading-[16px]`}
          >
            Ongoing
          </span>
        ) : isLoading ? (
          <Skeleton
            variant="rectangular"
            className="w-[30px] !h-5 lc mr-auto"
          />
        ) : (
          <div
            className={`text-f16 font-medium ${
              isSelected ? 'text-[#ffffff]' : 'text-[#EBEBEB]'
            } text-left leading-[16px]`}
          >
            {toFixed(divide(rewardAmount, 18) as string, 2)}
          </div>
        )}
      </div>
      {currentWeekId > weekId && !isLoading && (
        <Coin isAlloted={rewardAmount != '0'} isClaimed={isRewardClaimed} />
      )}
    </button>
  );
};

const Coin: React.FC<{ isAlloted: boolean; isClaimed: boolean }> = ({
  isAlloted,
  isClaimed,
}) => {
  if (isAlloted === false) {
    return <span></span>;
  } else if (isClaimed === true) {
    return (
      <div>
        <img
          src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/Rewards/Claimed.png`}
          alt="claimed"
          className="pb-1"
        />
      </div>
    );
  } else {
    return (
      <div>
        <img
          src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/Rewards/Unclaimed.png`}
          alt="unclaimed"
          className="pb-1"
        />
      </div>
    );
  }
};
