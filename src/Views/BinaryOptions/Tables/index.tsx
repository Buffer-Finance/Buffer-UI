import { ChangeEvent } from 'react';
import { IQTrade } from '..';
import PGDesktopTables from './Desktop';

interface IPGTables {
  configData: IQTrade;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  activePage: number;
}

const PGTables: React.FC<IPGTables> = ({
  configData,
  onPageChange,
  activePage,
}) => {
  return (
    <>
      <PGDesktopTables
        configData={configData}
        onPageChange={onPageChange}
        activePage={activePage}
      />
    </>
  );
};

export default PGTables;
