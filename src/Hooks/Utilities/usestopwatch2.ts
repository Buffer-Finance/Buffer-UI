import { useEffect, useState } from 'react';
export const isBalanceAvailable = (endTimestamp: number): boolean => {
  const distance = getDistance(endTimestamp);
  return distance <= 0;
};

export const timeVariables = (endTimestamp: number) => {
  const distance = getDistance(endTimestamp);
  const days = Math.floor(distance / (60 * 60 * 24));
  const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((distance % (60 * 60)) / 60);
  const seconds = Math.floor(distance % 60);
  return { distance, days, hours, minutes, seconds };
};
export const Variables = (distance: number) => {
  const days = Math.floor(distance / (60 * 60 * 24));
  const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((distance % (60 * 60)) / 60);
  const seconds = Math.floor(distance % 60);

  let adjustedHours = hours;
  let adjustedDays = days;

  // Adjust the display if hours are exactly 24
  // if (hours === 0 && minutes < 59) {
  //   adjustedHours = 24;
  //   adjustedDays = days - 1;
  // }

  return {
    distance,
    days: adjustedDays,
    hours: adjustedHours,
    minutes,
    seconds,
  };
};

export const getDistance = (endTimestamp: number): number => {
  // UNIX's epochs are in seconds, JS epochs millisecond, so first convert now's milliseconds to seconds.s
  const currentDate = new Date();
  const now = parseInt(currentDate.getTime().toString().slice(0, -3), 10);
  return Math.abs(endTimestamp - now);
};

export const serialize = function (obj) {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      if (obj[p] === undefined) continue;
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export function getStyle(el, styleProp) {
  var value,
    defaultView = (el.ownerDocument || document).defaultView;
  // W3C standard way:
  if (defaultView && defaultView.getComputedStyle) {
    // sanitize property name to css notation
    // (hypen separated words eg. font-Size)
    styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
  } else if (el.currentStyle) {
    // IE
    // sanitize property name to camelCase
    styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
      return letter.toUpperCase();
    });
    value = el.currentStyle[styleProp];
    // convert other units to pixels on IE
    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
      return (function (value) {
        var oldLeft = el.style.left,
          oldRsLeft = el.runtimeStyle.left;
        el.runtimeStyle.left = el.currentStyle.left;
        el.style.left = value || 0;
        value = el.style.pixelLeft + 'px';
        el.style.left = oldLeft;
        el.runtimeStyle.left = oldRsLeft;
        return value;
      })(value);
    }
    return value;
  }
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

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

export function useTimer2(timer) {
  const [distance, setdistance] = useState(getDistance(timer));
  console.log(`getDistance(timer): `, getDistance(timer));
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
    console.log(`getDistance(timer): `, getDistance(timer));

    setStopWatch(Variables(getDistance(timer)));
    console.log(
      `Variables(getDistance(timer)): `,
      Variables(getDistance(timer))
    );
  }, [distance]);
  return stopWatch;
}
