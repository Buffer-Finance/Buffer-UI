import { Popover } from "@mui/material";
import { useSetAtom } from "jotai";
import { useState } from "react";
import BufferTable from "@Views/Common/BufferTable";
import { CellContent } from "@Views/Common/BufferTable/CellInfo";
import { LeftBorderedDiv } from "@Views/Common/LeftBorderedDiv";
import { TableHeader } from "@Views/Pro/Common/TableHead";
import { DropdownArrow } from "@SVG/Elements/DropDownArrow"";
import { ForexTimingsModalAtom } from "./PGDrawer/CustomOption";

interface IMarketTimingsInfo {}

const MarketTimingsInfo: React.FC<IMarketTimingsInfo> = ({}) => {
  const setTimingsModal = useSetAtom(ForexTimingsModalAtom);

  return (
    <>
      <div
        className="bg-1 flex justify-center w-full text-6 text-f14 underline items-center cursor-pointer py-3 hover:text-1 hover:brightness-125"
        onClick={(e) => setTimingsModal(true)}
      >
        Market Timings
      </div>
    </>
  );
};

export { MarketTimingsInfo };
