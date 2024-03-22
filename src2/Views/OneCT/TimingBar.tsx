import { Bar } from '@Views/Common/Toast/style';
import { useEffect, useState } from 'react';

export const TimingBar = ({
  totalMiliSeconds,
  startTimer,
}: {
  totalMiliSeconds: number;
  startTimer: boolean;
}) => {
  //calculate width of bar based on total seconds. it should fill to 100% in given miliseconds after the timer starts
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (startTimer) {
      const interval = setInterval(() => {
        setWidth((width) => width + 1);
      }, totalMiliSeconds / 100);
      return () => clearInterval(interval);
    }
  }, [startTimer]);

  return <Bar width={width + '%'} color={'#4FBF67'} className="left-[0]" />;
};
