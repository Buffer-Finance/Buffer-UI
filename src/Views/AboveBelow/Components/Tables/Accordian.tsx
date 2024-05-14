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
    <div className="w-full bg-[#282B39] rounded-[2px] flex items-center  justify-between p-3 text-f14 text-2">
      <div className="flex gap-x-[15px]">
        {(['active', 'history', 'cancelled'] as accordianTableType[]).map(
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
              } ${
                gap.filter((i) => i == tableName).length
                  ? ' pr-[13px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              <div className="flex items-center gap-x-2 capitalize">
                {tableName == 'history' ? 'User History' : ''}
              </div>
            </button>
          )
        )}
        |
        {(['platform_active', 'platform_history'] as accordianTableType[]).map(
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
              } ${
                gap.filter((i) => i == tableName).length
                  ? ' pr-[13px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              <div className="flex items-center gap-x-2 capitalize">
                {tableName == 'platform_history'
                  ? tableName.replace('_', ' ')
                  : ''}
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
};
