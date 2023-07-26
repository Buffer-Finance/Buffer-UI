export function timeToMins(time: string) {
  if (!time) return;
  if (typeof time !== 'string') return;
  var b = time.split(':');

  return +b[0] * 60 + +b[1];
}
