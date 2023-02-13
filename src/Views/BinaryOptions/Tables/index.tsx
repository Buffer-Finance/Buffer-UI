import { ChangeEvent } from 'react';
import { IQTrade } from '..';
import PGDesktopTables from './Desktop';

interface IPGTables {
  configData: IQTrade;
  onPageChange?: (e: ChangeEvent, p: number) => void;
}

const PGTables: React.FC<IPGTables> = ({ configData, onPageChange }) => {
  return (
    <>
      <PGDesktopTables configData={configData} onPageChange={onPageChange} />
    </>
  );
};

export default PGTables;
