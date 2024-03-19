import { atomWithLocalStorage } from '@Utils/atomWithLocalStorage';
import { JackpotType, TradeType } from '@Views/TradePage/type';
import { atom, useAtom } from 'jotai';

export const JackpotSharesAtom = atomWithLocalStorage(
  'augmentation-jackpot-testing-v3',
  {
    jackpots: {},
    recent: '',
  } as { jackpots: { [key: string]: JackpotType }; recent: string }
);

export const useJackpotManager = () => {
  const [jackpotState, setJackpotState] = useAtom(JackpotSharesAtom);
  console.log(`jackpotState: `, jackpotState);

  const addJackpot = (jp: JackpotType) => {
    console.log(`jackpotdeb-: in add1`, jp);

    setJackpotState((s) => {
      const jackpotKey = getJackpotKey(jp);
      console.log(`jackpotdeb-: in add2`, jackpotKey);

      const newObj = { recent: jackpotKey, jackpots: { ...s.jackpots } };
      newObj.jackpots[jackpotKey] = jp;
      return newObj;
    });
  };
  const removeJackpot = (jp: JackpotType) => {
    setJackpotState((s) => {
      const jackpotKey = getJackpotKey(jp);
      console.log(`useJackpotManager-generatedKey: `, jackpotKey);

      const newObj = { recent: '', jackpots: { ...s.jackpots } };
      delete newObj.jackpots[jackpotKey];
      return newObj;
    });
  };
  const jackpotAcknowledged = () => {
    setJackpotState((s) => {
      const newObj = { recent: '', jackpots: { ...s.jackpots } };
      return newObj;
    });
  };
  const getJackpot = (tt: TradeType) => {
    const generatedKey = getJackpotKey(tt);
    console.log(`useJackpotManager-generatedKey: `, generatedKey);
    if (generatedKey in jackpotState.jackpots) {
      return jackpotState.jackpots[generatedKey];
    } else {
      return null;
    }
  };
  const jackpot = jackpotState;
  return {
    addJackpot,
    removeJackpot,
    getJackpot,
    jackpotAcknowledged,
    jackpot,
  };
};

export const getJackpotKey = (jp: Partial<JackpotType>): string => {
  return jp.target_contract + ':' + jp.option_id;
};
