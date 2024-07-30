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
  // const distance = getDistance(endTimestamp);
  const days = Math.floor(distance / (60 * 60 * 24));
  const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((distance % (60 * 60)) / 60);
  const seconds = Math.floor(distance % 60);
  return { distance, days, hours, minutes, seconds };
};

export const getDistance = (endTimestamp: number): number => {
  // UNIX's epochs are in seconds, JS epochs millisecond, so first convert now's milliseconds to seconds.s
  const currentDate = new Date();
  const now = parseInt(currentDate.getTime().toString().slice(0, -3), 10);
  console.log(`endTimestamp: `, endTimestamp, now);
  return endTimestamp - now;
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
