import {
  isWideTableEnabled,
  tableTypes,
} from '@Views/BinaryOptions/UserTrades';
import { ModalBase } from './Modals/BaseModal';
import { useState } from 'react';
import { ActiveTable, CancelTable, HistoryTable } from '@Views/BinaryOptions';
import { useAtomValue, useSetAtom } from 'jotai';

const WideTableModal: React.FC<any> = ({}) => {
  const isWideTableEnabledVal = useAtomValue(isWideTableEnabled);
  const setWideTable = useSetAtom(isWideTableEnabled);
  return (
    <ModalBase
      open={isWideTableEnabledVal}
      onClose={() => setWideTable(false)}
      className="!w-full !max-w-full"
    >
      <WideTables />
    </ModalBase>
  );
};

export { WideTableModal };

const WideTables = () => {
  const [tableType, setTableType] = useState(tableTypes[0]);
  const renderers = [ActiveTable, HistoryTable, CancelTable];
  return (
    <div className="w-full">
      <div className="sticky top-[0px] z-40 w-full bg-1 flex gap-x-5 px-5 justify-evenly text-f14 rounded-t-[8px] py-[8px]  ">
        {tableTypes.map((s) => {
          return (
            <div
              className={
                ' cursor-pointer ' + (tableType == s ? 'text-1' : 'text-2')
              }
              onClick={() => setTableType(s)}
            >
              {s}
            </div>
          );
        })}
      </div>
      {tableTypes.map((d, idx) => {
        if (d != tableType) return null;
        const ActiveRenderer = renderers[idx];

        return (
          <>
            {tableTypes.map((s, id) => {
              if (tableType == s) {
                return <ActiveRenderer width={1300} />;
              }
              return null;
            })}
          </>
        );
      })}
    </div>
  );
};
