// Convert minutes to a time in format hh:mm
// Returned value is in range 00  to 24 hrs
export function timeFromMins(mins: number) {
  function z(n: number) {
    return (n < 10 ? '0' : '') + n;
  }
  var h = ((mins / 60) | 0) % 24;
  var m = mins % 60;
  return z(h) + ':' + z(m);
}
