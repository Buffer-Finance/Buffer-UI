export const isNullAdds = (a: string) => {
  if (!a) return true;
  let n = a.length;
  let zeroCnt = 0;
  for (let c of a) {
    if (c == "0") zeroCnt++;
  }

  if (zeroCnt >= n - 1) return true;
  return false;
};
