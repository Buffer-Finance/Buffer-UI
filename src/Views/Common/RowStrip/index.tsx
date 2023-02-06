import { useState, useEffect, ReactNode } from "react";
import Background from "./style";

interface IRowStrip {
  FourCols: ReactNode[];
}

const RowStrip: React.FC<IRowStrip> = ({ FourCols }) => {
  return (
    <Background>
      {FourCols.map((single) => (
        <div className="each-col">{single}</div>
      ))}
    </Background>
  );
};

export default RowStrip;
