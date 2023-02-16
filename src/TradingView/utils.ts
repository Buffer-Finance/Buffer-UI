import { LatestPriceApi, Market2Kline, Market2Prices, Markets, OHLCBlock, WSUpdate } from "src/Types/Market";
import {
  ResolutionString,
} from 'public/static/charting_library';
export const timeDeltaMapping = (t:string | number) => {
    if (typeof t == 'string') {
      if (
        t.toLowerCase().includes('d') ||
        t.toLowerCase().includes('q') ||
        t.toLowerCase().includes('s')
      ) {
        return t.toLowerCase();
      }
    } 
    t=+t;
    if (t < 60) {
      // under minutes
      return t + 'm';
    }
    let ans:string;
    if (t < 1440) {
      // under hours
      ans = Math.round(t / 60) + 'h';
    } else {
      // under days
      ans = Math.round(t / 60 / 24) + 'd';
    }
  
    return ans;
  };

 export const getOHLCfromPrice = (priceObj:LatestPriceApi, time:number):OHLCBlock => {
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

  export function getBlockFromBar(bar:number[]  ):OHLCBlock {
    // FIXME 
    // if (typeof bar == 'number' && bar?.time) return bar;
    return {
      time: bar[0],
      open: bar[1],
      high: bar[2],
      low: bar[3],
      close: bar[4],
      volume: bar[5],
    };
  }

  export const getKlineFromPrice = (chunk:string) => {
    const priceObj:Partial<Market2Kline> = {};
    const res = chunk.toString();
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
                  const [assetName, decimalTs, numPrice] = assetString.split(':');
                  if (!assetName || !decimalTs || !numPrice) return;
  
                  const ts = (decimalTs as string).replace('.', '');
                  const absolutePrice = numPrice;
                  priceObj[assetName as Markets] = {
                      time: +ts,
                      close: +absolutePrice,
                      open: +absolutePrice,
                      high: +absolutePrice,
                      low: +absolutePrice,
                    };
                  
                }
              });
          });
        }
      });
    });
  
    return priceObj;
  };


  export const getAggregatedBarv2 = (prevBar:OHLCBlock, currentBar:WSUpdate, resolution:ResolutionString):OHLCBlock => {
    const resolutionInSeconds = +resolution * 60 * 1000;
    let updatedBar: OHLCBlock |null = null;
    const isSameCandle =
      Math.floor(currentBar.time / resolutionInSeconds) ==
      Math.floor(prevBar.time / resolutionInSeconds);
    if (isSameCandle)
      updatedBar = {
        time: currentBar.time,
        close: +currentBar.price,
        high: Math.max(+prevBar.high, +currentBar.price),
        low: Math.min(+prevBar.low, +currentBar.price),
        open: prevBar.close,
        volume: currentBar.volume,
      };
    else {
      updatedBar = {
        time: currentBar.time,
        close: +currentBar.price,
        high: +currentBar.price,
        low: +currentBar.price,
        open: +currentBar.price,
        volume: currentBar.volume,
      };
    }
    return updatedBar;
  };

  export const parsewsmsg = (res:string) => {
    const priceObj : Partial<Market2Prices> = {};
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