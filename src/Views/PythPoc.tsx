import { UTF8ArrToStr, getKlineFromPrice } from '@TV/utils';
import { multiply } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import Big from 'big.js';
import { useEffect, useState } from 'react';
const pythIds = {
  ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace: 'ETH-USD',
  e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43: 'BTC-USD',
};
const PythPoc: React.FC<any> = ({}) => {
  const [ad, setAd] = useState('');
  const getPrice = async () => {
    const price = await axios.get(
      `https://xc-mainnet.pyth.network/api/latest_price_feeds?` +
        Object.keys(pythIds)
          .map((d) => 'ids[]=0x' + d)
          .join('&')
    );
    const marketPrice = {};
    console.log(`price.data: `, price.data);
    price.data.forEach((e) => {
      marketPrice[pythIds[e.id]] = [
        {
          price: multiply(
            e.price.price,
            new Big('10').pow(e.price.expo).toString()
          ),
          time: e.price.publish_time * 1000,
        },
      ];
    });
    console.log(`price: `, marketPrice);
  };
  return (
    <div>
      Hell<button onClick={getPrice}>Click Me</button>
    </div>
  );
};

export { PythPoc };
