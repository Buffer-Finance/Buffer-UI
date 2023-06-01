import { TimePicker } from './TimePicker';

export const TimeSelector: React.FC = () => {
  return (
    <>
      <div>Time</div>
      <TimePicker
        currentTime="00:15"
        max_duration="00:15"
        min_duration="00:01"
        setCurrentTime={() => {
          console.log('lmao dont set');
        }}
      />
    </>
  );
};
