import {
  accordianTableTypeAtom,
  isTableShownAtom,
} from '@Views/AboveBelow/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { Accordian } from './Accordian';
import { TableSelector } from './TableSelector';

export const Tables: React.FC<{}> = () => {
  const activeTable = useAtomValue(accordianTableTypeAtom);
  const setExpanded = useSetAtom(isTableShownAtom);
  const isExpanded = useAtomValue(isTableShownAtom);

  return (
    <div className="flex flex-col w-full">
      <Accordian
        activeTableName={activeTable}
        expanded={isExpanded}
        setExpanded={setExpanded}
      />

      <div className={`  flex flex-col transition-all  overflow-y-hidden `}>
        <TableSelector activeTableName={activeTable} />
      </div>
    </div>
  );
};
