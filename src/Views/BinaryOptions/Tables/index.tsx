import { ChangeEvent } from 'react';
import { IQTrade } from '..';
import PGDesktopTables from './Desktop';

interface IPGTables {
  configData: IQTrade;
  count?: number;
  currentPage?: number;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  isHistoryTable?: boolean;
  shouldFetchOldData?: boolean;
}

const PGTables: React.FC<IPGTables> = ({
  configData,
  count,
  onPageChange,
  currentPage,
  shouldFetchOldData,
  isHistoryTable = false,
}) => {
  return (
    <>
      <PGDesktopTables
        className=""
        isHistoryTable={isHistoryTable}
        configData={configData}
        count={count}
        onPageChange={onPageChange}
        currentPage={currentPage}
        shouldFetchOldData={shouldFetchOldData}
      />
    </>
  );
};

export default PGTables;
