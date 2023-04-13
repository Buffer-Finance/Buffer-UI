import { useEffect, useRef, useState } from 'react';
import {
  PythConnection,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client';
import { Connection } from '@solana/web3.js';
import { valueClasses } from './Earn/Components/VestCards';
const solanaClusterName = 'pythnet';
const solanaWeb3Connection = 'https://pythnet.rpcpool.com/';
const PythPoc: React.FC<any> = ({}) => {
  const [ad, setAd] = useState('');
  const pythConnection = useRef(
    new PythConnection(
      new Connection(solanaWeb3Connection),
      getPythProgramKeyForCluster(solanaClusterName)
    )
  );
  useEffect(() => {
    console.log(
      `pythConnection.current.onPriceChange: `,
      pythConnection.current.onPriceChange
    );

    pythConnection.current.onPriceChange((p, o) => {
      if (!o?.price) {
        return;
      }
      setAd((ad) => {
        return ad + '\n|||' + p?.description + ' : ' + o?.price + '|||';
      });
    });
    pythConnection.current.start();
  }, []);
  return <div className={valueClasses}>{ad}</div>;
};

export { PythPoc };
