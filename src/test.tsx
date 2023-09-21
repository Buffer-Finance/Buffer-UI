import { useEffect, useState } from 'react';
import { atom, useSetAtom } from 'jotai';
import { usePrice } from '@Hooks/usePrice';
import useSWR from 'swr';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
const Test2: React.FC<any> = ({}) => {
  // const d = useOneCTWallet();
  const [string1, setString1] = useState('');
  const string1Clone = string1;
  const [string2, setString2] = useState('');
  const string2Clone = string2;
  const [obj1, setobj1] = useState({ h: '' });
  const obj1Clone = obj1;
  const [obj2, setobj2] = useState({ h: '' });
  const obj2Clone = obj2;
  useEffect(() => {
    console.log(`obj1-c${obj1}`);
  }, [obj1Clone]);
  useEffect(() => {
    console.log(`obj2-c${obj2}`);
  }, [obj2Clone]);
  useEffect(() => {
    console.log(`string1-c${string1}`);
  }, [string1Clone]);
  useEffect(() => {
    console.log(`string2-c${string2}`);
  }, [string2Clone]);
  return (
    <div>
      <div>
        string1:{' '}
        <input value={string1} onChange={(e) => setString1(e.target.value)} />
      </div>
      <div>
        string2:{' '}
        <input value={string2} onChange={(e) => setString2(e.target.value)} />
      </div>
      <div>
        obj1:{' '}
        <input
          value={obj1.h}
          onChange={(e) => setobj1({ h: e.target.value })}
        />
      </div>
      <div>
        obj2:{' '}
        <input
          value={obj2.h}
          onChange={(e) => setobj2({ h: e.target.value })}
        />
      </div>
    </div>
  );
};
const timeAtom = atom(0);
const Test = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
  // const setTime = useSetAtom(timeAtom);

  // usePrice();
  // return (
  //   <>
  //     <button type="button" style={{ float: 'right' }}>
  //       Confirm Selection
  //     </button>
  //   </>
  // );
};
export { Test };

const Test3 = () => {
  const { data } = useSWR('test', {
    fetcher: async () => {
      const query = `{
        deregisteredAccounts(
          first: 10000
          where: {
          updatedAt_gte: "0",
          }) {
                eoa
                nonce
                updatedAt
            }
          }`;

      const res = await axios.post(
        `https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/instant-trading-arbitrum-testnet/api
        `,
        {
          query,
        }
      );
      return res;
    },
  });
  console.log(data);
  return <></>;
};
