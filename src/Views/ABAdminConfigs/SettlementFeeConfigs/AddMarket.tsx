import { useToast } from '@Contexts/Toast';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { SettlementFeesChangedConfigAtom } from './store';

const inputClass = 'text-f14 px-3 py-2 rounded bg-3';
const buttonClass = 'text-f14 mt-4 px-3 py-2 rounded bg-3';
export const AddMarket = () => {
  const [shouldDisplayFields, setShouldDisplayFields] = useState(false);
  const [marketName, setMarketName] = useState('');
  const [c, setC] = useState(0);
  const [maxPayout, setMaxPayout] = useState(0);
  const [initialPayout, setInitialPayout] = useState(0);
  const setEditedObj = useSetAtom(SettlementFeesChangedConfigAtom);
  const toastify = useToast();

  function addMarket() {
    try {
      if (!marketName) throw new Error('Market name is required');
      if (!c) throw new Error('C is required');
      if (!maxPayout) throw new Error('maxPayout is required');
      if (!initialPayout) throw new Error('initialPayout is required');

      const newMarket = {
        [marketName]: {
          C: c,
          max_payout: maxPayout,
          initial_payout: initialPayout,
        },
      };
      setEditedObj((prev) => ({ ...prev, ...newMarket }));
      setShouldDisplayFields(false);
      setMarketName('');
      setC(0);
      setMaxPayout(0);
      setInitialPayout(0);

      toastify({
        msg: 'You have to submit the changes to make them live',
        type: 'success',
        id: 'market-added',
      });
    } catch (e) {
      toastify({
        msg: 'Error in adding market. ' + (e as Error).message,
        type: 'error',
        id: 'error-adding-market',
      });
    }
  }

  if (!shouldDisplayFields) {
    return (
      <button
        onClick={() => {
          setShouldDisplayFields(true);
        }}
        className={buttonClass}
      >
        Add Market
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Market Name"
        className={inputClass}
        onChange={(e) => setMarketName(e.target.value)}
      />
      <input
        type="number"
        placeholder="C"
        className={inputClass}
        onChange={(e) => setC(parseFloat(e.target.value))}
      />
      <input
        type="number"
        placeholder="max_payout"
        className={inputClass}
        onChange={(e) => setMaxPayout(parseFloat(e.target.value))}
      />
      <input
        type="number"
        placeholder="initial_payout"
        className={inputClass}
        onChange={(e) => setInitialPayout(parseFloat(e.target.value))}
      />
      <button onClick={addMarket} className={buttonClass}>
        Add
      </button>
    </div>
  );
};
