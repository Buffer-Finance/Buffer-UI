import { Variables, getDistance } from '@Utils/Time';
import { useEffect, useState } from 'react';

function getUnit(d, m) {
  if (d && d !== '' && d !== '0') {
    return d + m;
  }
  return '';
}
export const formatDistance = (stopWatch: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  let Days = stopWatch?.days || 0;
  let DaysHours = Days * 24 + stopWatch?.hours || 0;
  const withinAnHour = DaysHours <= 0;
  const withinADay = Days <= 0;
  return stopWatch
    ? `${getUnit(stopWatch.days, 'd ')}${getUnit(stopWatch.hours, 'h ')}${
        withinADay ? getUnit(stopWatch.minutes, 'm ') : ''
      }${withinAnHour ? getUnit(stopWatch.seconds, 's') : ''}`
    : null;
};
function addBoth(c: string, b) {
  if (!c && !b.includes('m') && !b.includes('h')) return '';

  let a = c.toString();
  return a.padStart(2, '0') + b;
}
export const formatDistanceExpanded = (stopWatch: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  return stopWatch
    ? `${addBoth(stopWatch.days.toString(), 'd ')}${addBoth(
        stopWatch.hours.toString(),
        'h '
      )}${addBoth(stopWatch.minutes.toString(), 'm ')}${addBoth(
        stopWatch.seconds.toString(),
        's'
      )}`
    : null;
};

export const formatDistanceCompact = (stopWatch: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  if (stopWatch) {
    let time: string = '';
    if (stopWatch.days > 0) {
      time += addBoth(stopWatch.days.toString(), 'd');
      time += ' ';
    }
    if (stopWatch.hours > 0) {
      time += addBoth(stopWatch.hours.toString(), 'h');
      time += ' ';
    }
    if (stopWatch.minutes > 0) {
      time += addBoth(stopWatch.minutes.toString(), 'm');
      time += ' ';
    }
    if (stopWatch.seconds > 0) {
      time += addBoth(stopWatch.seconds.toString(), 's');
    }
    console.log(time);
    return time;
  }
  return null;
};
export default function useStopWatch(timer: number) {
  const [distance, setdistance] = useState(getDistance(timer));
  const [stopWatch, setStopWatch] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const d = getDistance(timer);
    setdistance(d);
  }, [timer]);

  useEffect(() => {
    if (distance < 0) {
      setdistance(null);
    }
    const t = setInterval(() => {
      setdistance((distance) => {
        return distance > 0 ? distance - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(t);
    };
  }, [distance]);
  useEffect(() => {
    setStopWatch(Variables(getDistance(timer)));
  }, [distance]);
  return formatDistance(stopWatch);
}

export function useTimer(timer) {
  const [distance, setdistance] = useState(getDistance(timer));
  const [stopWatch, setStopWatch] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const d = getDistance(timer);
    setdistance(d);
  }, [timer]);

  useEffect(() => {
    if (distance < 0) {
      setdistance(null);
    }
    const t = setInterval(() => {
      setdistance((distance) => {
        return distance > 0 ? distance - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(t);
    };
  }, [distance]);
  useEffect(() => {
    setStopWatch(Variables(getDistance(timer)));
  }, [distance]);
  return stopWatch;
}
