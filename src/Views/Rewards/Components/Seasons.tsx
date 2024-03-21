import styled from '@emotion/styled';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

export const Seasons: React.FC<{
  selectedSeason: number;
  setSelectedSeason: (newSeason: number) => void;
}> = ({ selectedSeason, setSelectedSeason }) => {
  return (
    <div className="w-[325px] bg-[#141823] rounded-md">
      <div className="text-f20 font-medium text-[#F7F7F7] m-auto w-fit mt-5 mb-3">
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
                rewardAmount={3000}
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
