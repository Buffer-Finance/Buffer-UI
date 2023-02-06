import { useState, useEffect, ReactNode } from "react";
import Background from "./style";

interface ITableAssetCell {
  img: string;
  head: ReactNode;
  desc: ReactNode;
  chip?: ReactNode;
  className?: string;
}

const TableAssetCell: React.FC<ITableAssetCell> = ({
  className,
  head,
  desc,
  chip,
  img,
}) => {
  return (
    <Background className={className}>
      <img src={img} className="grid-asset-image-table"></img>
      <div className="grid-head whitespace-nowrap">{head}</div>
      <div className="grid-desc">{desc}</div>
      {chip && <div className="grid-chip">{chip}</div>}
    </Background>
  );
};

export default TableAssetCell;
