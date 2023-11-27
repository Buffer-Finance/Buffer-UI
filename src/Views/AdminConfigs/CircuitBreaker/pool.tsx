import { poolInfoType } from '@Views/TradePage/type';
import { useSetAtom } from 'jotai';
import { DataStates } from './DataStates';
import { poolAPRsAtom } from './atoms';

export const Pool: React.FC<{
  pool: poolInfoType & { apr: string; address: string };
}> = ({ pool }) => {
  const setAPRs = useSetAtom(poolAPRsAtom);

  function addAPR(newAPR: string) {
    setAPRs((prev) => {
      return [...prev, [newAPR, pool.address]];
    });
  }

  function removeAPR() {
    setAPRs((prev) => {
      return prev.filter((item) => {
        return item[1] !== pool.address;
      });
    });
  }

  return (
    <DataStates
      dataName={pool.token}
      defaultState={pool.apr}
      onDeSelectCheckBox={removeAPR}
      onSelectCheckBox={addAPR}
    />
  );
};
