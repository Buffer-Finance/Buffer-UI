import { ReactNode } from "react";
import BufferTable from "@Views/Common/BufferTable";
import { CellContent } from "@Views/Common/BufferTable/CellInfo";

interface IReferralLinksTable {
  className?: string;
  links: {
    code: string;
    volume: number;
    trades: number;
    rebates: number;
  }[];
  children?: ReactNode;
}

const colMapping = {
  0: "Referral code",
  1: "Total Volume",
  2: "Traders Referred",
  3: "Total Trades",
};
const mobMapping = {
  0: "Code",
  1: "Volume",
  2: "Referrers",
  3: "Total Trades",
};

const ReferralLinksTable: React.FC<IReferralLinksTable> = ({
  className,
  links,
  children,
}) => {
  const ReferralTableBody = (row, col) => {
    switch (col) {
      case 0:
        return <CellContent className="nsm:p-2 " content={[links[col].code]} />;
      case 1:
        return <CellContent content={[links[col].volume]} />;
      case 2:
        return <CellContent content={[links[col].trades]} />;
      case 3:
        return <CellContent content={[links[col].rebates]} />;
    }
    return <div></div>;
  };

  return (
    <BufferTable
      bodyJSX={ReferralTableBody}
      rows={links.length}
      className={className}
      cols={4}
      onRowClick={console.log}
      shouldShowMobile
      headerJSX={(col) => {
        return (
          <div>
            {typeof window !== "undefined" && window.innerWidth < 600
              ? mobMapping[col]
              : colMapping[col]}
          </div>
        );
      }}
    ></BufferTable>
  );
};

export default ReferralLinksTable;
