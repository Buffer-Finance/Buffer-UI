import {
  priceAtom,
  ts2asset2updatecnt,
  usePrice,
  usePriceRetriable,
} from '@Hooks/usePrice';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
const PerformantUpdatesTest: React.FC<any> = ({}) => {
  usePriceRetriable();
  const prices = useAtomValue(priceAtom);

  useEffect(() => {}, [prices]);
  const op = () => {
    console.log(
      `PerformantUpdatesTest-ts2asset2updatecnt: `,
      ts2asset2updatecnt
    );
  };
  return (
    <div className="flex flex-col ">
      <button onClick={op}>Console log</button>
      {Object.entries(prices).map((V) => {
        return (
          <div key={V[0]}>
            {V[0]}:{V[1]?.[0].price} at {V[1]?.[0].time}
          </div>
        );
      })}
    </div>
  );
};

export { PerformantUpdatesTest };
