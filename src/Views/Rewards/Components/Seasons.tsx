import styled from '@emotion/styled';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { useState } from 'react';

export const Seasons = () => {
  return (
    <div className="w-[325px] bg-[#141823] rounded-md">
      <div className="text-f20 font-medium text-[#F7F7F7] m-auto w-fit mt-5 mb-3">
        All Seasons
      </div>
      <TimeLine />
    </div>
  );
};

const TimeLine = () => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  return (
    <Timeline position="alternate">
      <BufferLineItem className="">
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot
            isSelected={selectedSeason === 1}
            isRightSelected={selectedSeason % 2 === 0}
          />
        </TimelineSeparator>
        <BufferContent>
          <Season
            isSelected={selectedSeason === 1}
            rewardAmount={3000}
            seasonNum={1}
            onClick={setSelectedSeason}
          />
        </BufferContent>
      </BufferLineItem>
      <BufferLineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot
            isSelected={selectedSeason === 2}
            isRightSelected={selectedSeason % 2 === 0}
          />
        </TimelineSeparator>
        <BufferContent>
          <Season
            isSelected={selectedSeason === 2}
            rewardAmount={786}
            seasonNum={2}
            onClick={setSelectedSeason}
          />
        </BufferContent>
      </BufferLineItem>
      <BufferLineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot
            isSelected={selectedSeason === 3}
            isRightSelected={selectedSeason % 2 === 0}
          />
        </TimelineSeparator>
        <BufferContent>
          <Season
            isSelected={selectedSeason === 3}
            rewardAmount={4356}
            seasonNum={3}
            onClick={setSelectedSeason}
          />
        </BufferContent>
      </BufferLineItem>
      <BufferLineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot
            isSelected={selectedSeason === 4}
            isRightSelected={selectedSeason % 2 === 0}
          />
        </TimelineSeparator>
        <BufferContent>
          <Season
            isSelected={selectedSeason === 4}
            rewardAmount={999}
            seasonNum={4}
            onClick={setSelectedSeason}
          />
        </BufferContent>
      </BufferLineItem>
      <BufferLineItem>
        <TimelineSeparator>
          <BufferConnector />
          {/* <BufferDot /> */}
        </TimelineSeparator>
        <BufferContent> </BufferContent>
      </BufferLineItem>
    </Timeline>
  );
};

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
  rewardAmount: number;
  onClick: (newSeason: number) => void;
  isSelected: boolean;
}> = ({ seasonNum, rewardAmount, onClick, isSelected }) => {
  function handleSeasonCLick() {
    onClick(seasonNum);
  }

  return (
    <button
      className={`px-[9px] py-[7px] ${
        isSelected ? 'bg-[#3772FF] scale-110' : 'bg-[#2C2C41]'
      } rounded-md flex items-end justify-between w-full`}
      onClick={handleSeasonCLick}
    >
      <div>
        <div
          className={`text-f12 font-medium ${
            isSelected ? 'text-[#ffffff]' : 'text-[#C3C2D4]'
          }`}
        >
          Season {seasonNum}
        </div>
        <div
          className={`text-f16 font-medium ${
            isSelected ? 'text-[#ffffff]' : 'text-[#EBEBEB]'
          } text-left leading-[16px]`}
        >
          {rewardAmount}
        </div>
      </div>
      <Coin isAlloted={true} isClaimed={false} />
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
        />
      </div>
    );
  } else {
    return (
      <div>
        <img
          src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/Rewards/Unclaimed.png`}
          alt="unclaimed"
        />
      </div>
    );
  }
};
