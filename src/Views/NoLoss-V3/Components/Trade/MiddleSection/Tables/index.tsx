import { accordianTableTypeAtom } from '@Views/NoLoss-V3/atoms';
import { isTableShownAtom } from '@Views/TradePage/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { Accordian } from './Accordian';
import { TableSelector } from './TableSelector';

export const Tables = () => {
  const activeTable = useAtomValue(accordianTableTypeAtom);
  const [expanded, setExpanded] = useAtom(isTableShownAtom);
  return (
    <div className="flex flex-col">
      <Accordian
        activeTableName={activeTable}
        expanded={expanded}
        setExpanded={setExpanded}
      />
      <div
        className={` ${
          expanded ? 'h-[355px]' : 'h-[0px]'
        } flex flex-col transition-all  overflow-y-hidden `}
      >
        <TableSelector activeTableName={activeTable} />
      </div>
    </div>
  );
};
