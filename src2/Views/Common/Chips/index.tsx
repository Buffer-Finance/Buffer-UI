import { useState, useEffect, ReactNode } from "react";
import { BlueChipBG } from "./style";

interface IBlueChip {
  className?: string;
  data: ReactNode;
}

const BlueChip: React.FC<IBlueChip> = ({ className, data }) => {
  return <BlueChipBG className={className}>{data}</BlueChipBG>;
};

export default BlueChip;
