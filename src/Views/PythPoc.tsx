import { useEffect, useState } from 'react';
function UTF8ArrToStr(aBytes) {
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
const getKlineFromPrice = (asset) => {
  const priceObj = {};

  asset.split('\n').forEach((newLinesSplitted, idx) => {
    if (newLinesSplitted) {
      newLinesSplitted.split('\r').forEach((assetString, idx) => {
        if (assetString) {
          console.log(`assetString: `, assetString);
          try {
            if (assetString.length > 4) {
              const parsed = JSON.parse(assetString);
              if (parsed.id.includes('BTC')) {
                console.log(`parsed: `, parsed);
              }
            }
          } catch (err) {}
          // try {
          //   const [assetName, decimalTs, numPrice] = assetString.split(':');
          //   const ts = (decimalTs as string).replace('.', '');
          //   const absolutePrice = numPrice;
          //   priceObj[assetName] = [
          //     {
          //       time: +ts,
          //       close: absolutePrice,
          //       open: absolutePrice,
          //       high: absolutePrice,
          //       low: absolutePrice,
          //     },
          //   ];
          // } catch (err) {
          //   console.log(`[getKlineFromPrice]err: `, assetString);
          //   // TODO remove throwing error
          //   throw new Error('it is that');
          // }
        }
      });
    }
  });

  return priceObj;
};

const PythPoc: React.FC<any> = ({}) => {
  const [ad, setAd] = useState('');

  const fn = async () => {
    const url = 'https://pyth-api.vintage-orange-muffin.com/v2/streaming';
    const response = await fetch(url);
    const reader = response.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const updateStr = UTF8ArrToStr(value);
      console.log('Received', getKlineFromPrice(updateStr));
    }
  };
  useEffect(() => {
    fn();
  }, []);
  return <div>Hello</div>;
};

export { PythPoc };
