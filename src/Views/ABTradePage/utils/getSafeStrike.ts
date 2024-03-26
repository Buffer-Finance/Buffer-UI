export function getSafeStrike(
  strike: number,
  isAbove: boolean,
  // spreadConfig1: number,
  // spreadConfig2: number,
  // spreadFactor: number,
  // totalMarketOI: number,
  // getMaxOI: number,
  // iv: number,
  spread: number
): number {
  // const spread = getSpread(
  //   spreadConfig1,
  //   spreadConfig2,
  //   spreadFactor,
  //   iv,
  //   totalMarketOI,
  //   getMaxOI
  // );
  if (isAbove) {
    return (strike * (1e8 + spread)) / 1e8;
  } else {
    return (strike * (1e8 - spread)) / 1e8;
  }
}

// function getSpread(
//   spreadConfig1: number,
//   spreadConfig2: number,
//   spreadFactor: number,
//   iv: number,
//   totalMarketOI: number = 1,
//   getMaxOI: number = 1
// ) {
//   const m = Math.floor((spreadConfig2 - spreadConfig1) / 1350);
//   const c = Math.floor((22 * spreadConfig1 - 5 * spreadConfig2) / 27);
//   let spread = m * iv + c;
//   spread =
//     Math.floor((spread * spreadFactor * totalMarketOI) / (1e3 * getMaxOI)) +
//     spread;

//   return spread;
// }

// export function getMaxSpread(
//   spreadConfig1: number,
//   spreadConfig2: number,
//   spreadFactor: number,
//   iv: number
// ) {
//   return getSpread(spreadConfig1, spreadConfig2, spreadFactor, iv);
// }
