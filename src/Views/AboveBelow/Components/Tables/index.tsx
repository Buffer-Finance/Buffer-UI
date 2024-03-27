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
    <div className="flex flex-col">
      <Accordian
        activeTableName={activeTable}
        expanded={isExpanded}
        setExpanded={setExpanded}
      />

      <div
        className={` ${
          isExpanded ? 'h-[355px]' : 'h-[0px]'
        } flex flex-col transition-all  overflow-y-hidden `}
      >
        {isExpanded && <TableSelector activeTableName={activeTable} />}
      </div>
    </div>
  );
};
