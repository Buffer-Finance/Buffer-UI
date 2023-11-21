import { Bar } from '@Views/Common/Toast/style';
import { useEffect, useState } from 'react';

export const TimingBar = ({
  totalMiliSeconds,
  startTimer,
  color = '#4FBF67',
}: {
  totalMiliSeconds: number;
  startTimer: boolean;
  color?: string;
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

  return <Bar width={width + '%'} color={color} className="left-[0]" />;
};
