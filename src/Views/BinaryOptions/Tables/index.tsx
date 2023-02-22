import { ChangeEvent } from 'react';
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
  activePage,
  shouldNotDisplayShareVisulise = false,
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
