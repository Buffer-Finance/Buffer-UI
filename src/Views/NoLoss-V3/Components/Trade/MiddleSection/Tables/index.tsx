import { accordianTableTypeAtom } from '@Views/NoLoss-V3/atoms';
import { useAtomValue } from 'jotai';
import { Accordian } from './Accordian';

export const Tables = () => {
  const activeTable = useAtomValue(accordianTableTypeAtom);

  return <Accordian activeTableName={activeTable} />;
};
