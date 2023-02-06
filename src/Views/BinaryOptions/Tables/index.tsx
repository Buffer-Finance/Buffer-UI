import { ChangeEvent } from "react";
import BufferDisclaimer from "@Views/Common/BufferDisclaimer";
import { IQTrade } from "..";
import PGDesktopTables from "./Desktop";

interface IPGTables {
  configData: IQTrade;
  count?: number;
  currentPage?: number;
  onPageChange?: (e: ChangeEvent, p: number) => void;
  className?: string;
  isHistoryTable?: boolean;
  shouldFetchOldData?: boolean;
}

const PGTables: React.FC<IPGTables> = ({
  configData,
  className,
  count,
  onPageChange,
  currentPage,
  shouldFetchOldData,
  isHistoryTable = false,
}) => {
  return (
    <>
      {/* <BufferDisclaimer
        content={
          "Due to network congestion the changes will show up in some time (<1min)"
        }
      /> */}
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
