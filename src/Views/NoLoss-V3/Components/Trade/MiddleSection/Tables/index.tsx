import {
  accordianTableTypeAtom,
  isTableShownAtom,
} from '@Views/NoLoss-V3/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { Accordian } from './Accordian';
import { TableSelector } from './TableSelector';

export const Tables: React.FC<{
  isExpanded: boolean;
  shouldHideExpandBtn: boolean;
  isTournamentClosed: boolean;
}> = ({ isExpanded, shouldHideExpandBtn, isTournamentClosed }) => {
  const activeTable = useAtomValue(accordianTableTypeAtom);
  const setExpanded = useSetAtom(isTableShownAtom);
  return (
    <div className="flex flex-col">
      <Accordian
        activeTableName={activeTable}
        expanded={isExpanded}
        setExpanded={setExpanded}
        shouldHideExpandBtn={shouldHideExpandBtn}
      />

      <div
        className={` ${
          isTournamentClosed ? 'h-full' : isExpanded ? 'h-[355px]' : 'h-[0px]'
        } flex flex-col transition-all  overflow-y-hidden `}
      >
        {isExpanded && (
          <TableSelector
            activeTableName={activeTable}
            isTournamentClosed={isTournamentClosed}
          />
        )}
      </div>
    </div>
  );
};
