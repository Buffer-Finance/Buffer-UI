import { ChangeEvent } from 'react';
import BufferDisclaimer from '@Views/Common/BufferDisclaimer';
import { IQTrade } from '..';
import PGDesktopTables from './Desktop';

interface IPGTables {
  configData: IQTrade;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  activePage: number;
  shouldNotDisplayShareVisulise?: boolean;
}

const PGTables: React.FC<IPGTables> = ({
  configData,
  onPageChange,
  currentPage,
  shouldFetchOldData,
  isHistoryTable,
}) => {
  return (
    <>
      <PGDesktopTables
        configData={configData}
        onPageChange={onPageChange}
        activePage={activePage}
        shouldNotDisplayShareVisulise={shouldNotDisplayShareVisulise}
      />
    </>
  );
};

export default PGTables;
