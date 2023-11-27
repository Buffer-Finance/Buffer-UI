import { responseObj } from '@Views/TradePage/type';
import { useSetAtom } from 'jotai';
import { DataStates } from './DataStates';
import { thresholdsAtom } from './atoms';

export const Market: React.FC<{
  market: responseObj & { threshold: string };
}> = ({ market }) => {
  const setThresholds = useSetAtom(thresholdsAtom);

  function removeThreshold() {
    setThresholds((prev) => {
      return prev.filter((item) => {
        return item[1] !== market.address;
      });
    });
  }
  function addThreshold(newThreshold: string) {
    setThresholds((prev) => {
      return [...prev, [newThreshold, market.address]];
    });
  }

  return (
    <DataStates
      onSelectCheckBox={addThreshold}
      onDeSelectCheckBox={removeThreshold}
      dataName={market.asset}
      defaultState={market.threshold}
    />
  );
};
