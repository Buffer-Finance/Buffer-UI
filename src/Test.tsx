import { Display } from '@Views/Common/Tooltips/Display';
import Config from 'public/config.json';
import { useEffect, useState } from 'react';
const initD = ['800123.32', '22313.2312', '312312.11', '32131123.231'];
const Decd = ['800123.31', '22313.2311', '312312.10', '32131123.230'];
import { atom, useAtomValue, useSetAtom } from 'jotai';
import useWebSocket from 'react-use-websocket';
import {  Market2Prices, Markets } from './Types/Market';
import { TradingChart } from './TradingView';

const Test: React.FC<any> = ({}) => {
  usePrice();
  const price = useAtomValue(priceAtom);

  const obj = Config;
  return <div className="flex ">
    
    <TradingChart market='BTCUSD' /></div>;
};

const parsewsmsg = (res:string) => {
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
function usePrice() {
  const setPrice = useSetAtom(priceAtom);
  useWebSocket('wss://oracle-v2.buffer.finance', {
    onMessage: (price) => {
      const priceUpdates = parsewsmsg(price.data);
      setPrice(priceUpdates);
    },
  });
}


export const priceAtom = atom<Partial<Market2Prices>>({});
export { Test };
