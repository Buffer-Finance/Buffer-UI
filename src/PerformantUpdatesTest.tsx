import {
  priceAtom,
  ts2asset2updatecnt,
  usePrice,
  usePriceRetriable,
} from '@Hooks/usePrice';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
const PerformantUpdatesTest: React.FC<any> = ({}) => {
  const prices = useAtomValue(priceAtom);

  useEffect(() => {}, [prices]);
  const op = () => {
    console.log(
      `PerformantUpdatesTest-ts2asset2updatecnt: `,
      ts2asset2updatecnt
    );
    // display min max avg
    let tsstats = {};
    for (let ts in ts2asset2updatecnt) {
      let individualMin = 1000000000;
      let inidvidulaMax = -1;
      let total = 0;
      let avg;
      for (let asset in ts2asset2updatecnt[ts]) {
        individualMin = Math.min(ts2asset2updatecnt[ts][asset], individualMin);
        inidvidulaMax = Math.max(inidvidulaMax, ts2asset2updatecnt[ts][asset]);
        total += ts2asset2updatecnt[ts][asset];
      }
      avg = total / Object.keys(ts2asset2updatecnt[ts]).length;
      tsstats[ts] = {
        individualMin,
        inidvidulaMax,
        avg,
        total,
      };
    }
    console.log(tsstats, 'here are your stats');
    console.log('here is actual : ', ts2asset2updatecnt);
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
