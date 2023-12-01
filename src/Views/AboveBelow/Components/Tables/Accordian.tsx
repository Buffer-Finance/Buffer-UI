import DDArrow from '@SVG/Elements/Arrow';
import { accordianTableTypeAtom } from '@Views/AboveBelow/atoms';
import { accordianTableType } from '@Views/AboveBelow/types';
import { useSetAtom } from 'jotai';

export const Accordian: React.FC<{
  activeTableName: accordianTableType;
  expanded: boolean;
  setExpanded: (isExpended: boolean) => void;
}> = ({ activeTableName, expanded, setExpanded }) => {
  const setActiveTable = useSetAtom(accordianTableTypeAtom);
  const gap = [''];

  return (
    <div className="w-full bg-[#282B39] rounded-[2px] flex items-center  justify-between p-3 ">
      <div className="flex gap-x-[15px]">
        {(['leaderBoard', 'history', 'cancelled'] as accordianTableType[]).map(
          (tableName) => (
            <button
              onClick={() => {
                setExpanded(true);
                setActiveTable(tableName);
              }}
              key={tableName}
              className={`text-${
                tableName.toLowerCase() == activeTableName.toLowerCase()
                  ? '1'
                  : '2'
              } text-f14 ${
                gap.filter((i) => i == tableName).length
                  ? ' pr-[13px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              <div className="flex items-center gap-x-2 capitalize">
                {tableName}
              </div>
            </button>
          )
        )}
      </div>
      <button
        className="flex items-center gap-x-2 px-4 text-f14 transition group"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide ' : 'Show '} Positions
        <DDArrow
          className={`transition scale group-hover:scale-150  ${
            expanded ? ' rotate-0' : 'rotate-180'
          }`}
        />
      </button>
    </div>
  );
};
