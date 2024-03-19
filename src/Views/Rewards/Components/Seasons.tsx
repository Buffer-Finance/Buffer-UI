import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

export const Seasons = () => {
  return (
    <Timeline position="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot />
        </TimelineSeparator>
        <TimelineContent sx={{ width: 'fit-content' }}>
          <Season rewardAmount={3000} seasonNum={1} />
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot />
        </TimelineSeparator>
        <TimelineContent>
          <Season rewardAmount={786} seasonNum={2} />
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot />
        </TimelineSeparator>
        <TimelineContent>
          <Season rewardAmount={4356} seasonNum={3} />
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <BufferConnector />
          <BufferDot />
        </TimelineSeparator>
        <TimelineContent>
          <Season rewardAmount={999} seasonNum={4} />
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <BufferConnector />
          {/* <BufferDot /> */}
        </TimelineSeparator>
        <TimelineContent> </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
};

const BufferConnector = () => {
  return <TimelineConnector sx={{ backgroundColor: '#2C2C41', width: 4 }} />;
};

const BufferDot = () => {
  return <TimelineDot sx={{ backgroundColor: '#464660', margin: 0 }} />;
};

const Season: React.FC<{ seasonNum: number; rewardAmount: number }> = ({
  seasonNum,
  rewardAmount,
}) => {
  return (
    <div className="px-[9px] py-[7px] bg-[#2C2C41] rounded-md">
      <div className="text-f12 font-medium text-[#C3C2D4]">
        Season {seasonNum}
      </div>
      <div className="text-f16 font-medium text-[#EBEBEB]">{rewardAmount}</div>
    </div>
  );
};
