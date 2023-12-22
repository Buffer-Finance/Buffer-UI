import { getDistance } from '@Utils/Time';
import React, { ReactNode } from 'react';
import { TimerBox } from '../Incentivised';

export const TimerOrData: React.FC<{
  Data: ReactNode;
  startTimestamp: number;
}> = ({ Data, startTimestamp }) => {
  const launchTimeStamp = startTimestamp / 1000;
  const distance = getDistance(launchTimeStamp);
  const isTimerEnded = distance <= 0;
  if (!isTimerEnded) {
    return (
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
  }
  return Data;
};
