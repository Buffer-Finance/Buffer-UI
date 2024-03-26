import {
  LatestPriceApi,
  Market2Kline,
  Market2Prices,
  Markets,
  OHLCBlock,
  WSUpdate,
} from 'src/Types/Market';
import { ResolutionString } from 'public/static/charting_library';
import { TradeType } from '@Views/ABTradePage/type';
export const timeDeltaMapping = (t: string | number) => {
  if (typeof t == 'string') {
    if (
      t.toLowerCase().includes('d') ||
      t.toLowerCase().includes('q') ||
      t.toLowerCase().includes('s')
    ) {
      return t.toLowerCase();
    }
  }
  t = +t;
  if (t < 60) {
    // under minutes
    return t + 'm';
  }
  let ans: string;
  if (t < 1440) {
    // under hours
    ans = Math.round(t / 60) + 'h';
  } else {
    // under days
    ans = Math.round(t / 60 / 24) + 'd';
  }

  return ans;
};

export const getOHLCfromPrice = (
  priceObj: LatestPriceApi,
  time: number
): OHLCBlock => {
  const a = {
    close: priceObj.p,
    open: priceObj.p,
    low: priceObj.p,
    high: priceObj.p,

    time,
    '24h_change': priceObj['24h_change'],
  };
  return a;
};

export function getBlockFromBar(bar: number[]): OHLCBlock {
  return {
    time: +bar[0],
    open: +bar[1],
    high: +bar[2],
    low: +bar[3],
    close: +bar[4],
    volume: +bar[5],
  };
}

export const resolution2Sec = (resolution: string) => {
  // console.log(`[dd]]resolution: `, resolution);

  let inSec = +resolution * 60 * 1000;
  if (resolution.includes('S') || resolution.includes('s')) {
    let numericResolution = resolution.replace('S', '');
    numericResolution = numericResolution.replace('s', '');
    inSec = +numericResolution * 1000;
  }
  return inSec;
};

export const getAggregatedBarv2 = (
  prevBar: OHLCBlock,
  currentBar: WSUpdate,
  resolution: ResolutionString
): OHLCBlock => {
  const resolutionInSeconds = resolution2Sec(resolution);
  let updatedBar: OHLCBlock | null = null;
  const currCandleIndex = Math.floor(Date.now() / resolutionInSeconds);
  // console.log(`[sync]currCandleIndex: `, currCandleIndex);
  const prevCandleIndex = Math.floor(prevBar.time / resolutionInSeconds);
  // console.log(`[sync]prevCandleIndex: `, prevCandleIndex);
  const isSameCandle = currCandleIndex == prevCandleIndex;
  const time = currCandleIndex * resolutionInSeconds;
  if (isSameCandle)
    updatedBar = {
      time,
      close: +currentBar.price,
      high: Math.max(+prevBar.high, +currentBar.price),
      low: Math.min(+prevBar.low, +currentBar.price),
      open: prevBar.open,
      volume: currentBar.volume,
    };
  else {
    updatedBar = {
      time,
      close: +currentBar.price,
      high: +currentBar.price,
      low: +currentBar.price,
      open: +prevBar.close,
      volume: currentBar.volume,
    };
  }
  // console.log(`[sync]updatedBar: `, updatedBar);

  const d = new Date(time);
  const e = new Date(prevBar.time);
  return updatedBar;
};

export const parsewsmsg = (res: string) => {
  const priceObj: Partial<Market2Prices> = {};
  const assets = res.split('|');
  let partial = false;

  let secondLastCharacter =
    assets[assets.length - 1][assets[assets.length - 1].length - 2];
  if (secondLastCharacter != '|') {
    partial = true;
  }

  assets.forEach((asset, idx) => {
    if (partial && idx === assets.length - 1) return;
    asset.split('\n').forEach((newLinesSplitted, idx) => {
      if (newLinesSplitted) {
        newLinesSplitted.split('|').forEach((orSplitted, idx) => {
          if (orSplitted)
            orSplitted.split('\r').forEach((assetString, idx) => {
              if (assetString) {
                if (assetString.includes('[')) return;
                const [assetName, decimalTs, numPrice, volume] =
                  assetString.split(':');
                if (!assetName || !decimalTs || !numPrice) return;
                const [s, ms] = (decimalTs as string).split('.');
                const ts = +s * 1000 + +ms;
                const absolutePrice = numPrice;
                const priceUpdate = {
                  time: +ts,
                  price: absolutePrice,
                  volume: volume ? +volume : 0,
                };
                if (!priceObj[assetName as Markets]) {
                  priceObj[assetName as Markets] = [priceUpdate];
                } else {
                  priceObj[assetName as Markets]?.push(priceUpdate);
                }
              }
            });
        });
      }
    });
  });

  return priceObj;
};

export const getVizIdentifier = (a: TradeType) => {
  return +a.optionID! + '-' + a.configPair!.pair;
};

export function UTF8ArrToStr(aBytes) {
  let sView = '';
  let nPart;
  const nLen = aBytes.length;
  for (let nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCodePoint(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */
        ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So…: */
          (nPart - 252) * 1073741824 +
            ((aBytes[++nIdx] - 128) << 24) +
            ((aBytes[++nIdx] - 128) << 18) +
            ((aBytes[++nIdx] - 128) << 12) +
            ((aBytes[++nIdx] - 128) << 6) +
            aBytes[++nIdx] -
            128
        : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */
        ? ((nPart - 248) << 24) +
          ((aBytes[++nIdx] - 128) << 18) +
          ((aBytes[++nIdx] - 128) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
        : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */
        ? ((nPart - 240) << 18) +
          ((aBytes[++nIdx] - 128) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
        : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */
        ? ((nPart - 224) << 12) +
          ((aBytes[++nIdx] - 128) << 6) +
          aBytes[++nIdx] -
          128
        : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */
        ? ((nPart - 192) << 6) + aBytes[++nIdx] - 128
        : /* nPart < 127 ? */ /* one byte */
          nPart
    );
  }
  return sView;
}
const supportedAssets = ['BTC/USD', 'GBP/USD', 'EUR/USD', 'ETH/USD'];
export const getKlineFromPrice = (asset) => {
  const priceObj = {};

  asset.split('\n').forEach((newLinesSplitted, idx) => {
    if (newLinesSplitted) {
      newLinesSplitted.split('\r').forEach((assetString, idx) => {
        if (assetString) {
          try {
            if (assetString.length > 4) {
              const parsed = JSON.parse(assetString);
              if (parsed?.id && supportedAssets.includes(parsed.id))
                priceObj[parsed.id.replace('/', '')] = [
                  {
                    time: parsed.t * 1000,
                    price: parsed.p,
                  },
                ];
            }
          } catch (err) {}
        }
      });
    }
  });

  return priceObj;
};
