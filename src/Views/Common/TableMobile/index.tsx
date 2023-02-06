import { Avatar, Button, Skeleton } from "@mui/material";
import { ChangeEvent, ReactChild, ReactNode, useState } from "react";
import Background from "./style";
import { createArray } from "@Utils/JSUtils/createArray";
import { European, American } from "config";
import TypeChip from "../TypeChip";
import BasicPagination from "../pagination";

interface TableMobileProps {
  rows: number;
  bodyJSX: (
    row: number,
    selectedIndex?: number,
    handleClick?: (idx: number) => void
  ) => ReactChild;
  error?: ReactNode;
  loading?: boolean;
  count?: number;
  shouldShowTroply?: boolean;
  onPageChange?: (e: ChangeEvent, p: number) => void;
}

const TableMobile: React.FC<TableMobileProps> = ({
  rows,
  bodyJSX,
  error,
  loading,
  count,
  onPageChange,
  shouldShowTroply = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleClick = (idx: number) => setSelectedIndex(idx);
  return (
    <Background>
      {loading ? (
        <Skeleton className="lc sxr h wf" />
      ) : rows ? (
        createArray(rows).map((index) => {
          return (
            <div key={index} className="flex-col cell">
              {bodyJSX(index, selectedIndex, handleClick)}
            </div>
          );
        })
      ) : (
        <div className="flexc-center body font3 error">{error}</div>
      )}

      {count ? (
        <BasicPagination
          onChange={onPageChange}
          count={count}
          shouldShowTroply={shouldShowTroply}
        />
      ) : null}
    </Background>
  );
};

interface AssetProps {
  name: string;
  img: string;
  type: string;
  icon?: string;
  isEuropean?: boolean;
  isCallbooster?: boolean;
}

export const AssetCellMobile: React.FC<AssetProps> = ({
  name,
  img,
  type,
  icon,
  isEuropean,
  isCallbooster,
}) => {
  return (
    <div className="flex items-center">
      <img
        className="sxmr asset-img"
        alt={name}
        src={img}
        style={{ width: 30, height: 30 }}
      />
      <div className="flex-col items-start">
        <div className="flex items-center">
          <span className="highlight" style={{ fontSize: "15px" }}>
            {name}
          </span>
          {icon && (
            <div
              className="version-chip font3 sxml"
              style={{ fontSize: "10px" }}
            >
              {icon}
            </div>
          )}
          {isCallbooster && (
            <TypeChip
              type={isEuropean ? European : American}
              className="sxml"
            />
          )}
        </div>
        <span className="desc-text" style={{ fontSize: "13px" }}>
          {type}
        </span>
      </div>
    </div>
  );
};

interface InfoProps {
  title: string;
  text: string | ReactChild;
  align?: "right" | "left";
  className?: string;
}

export const InfoCell: React.FC<InfoProps> = ({
  title,
  text,
  align,
  className,
}) => {
  return (
    <div
      className={`flex-col items-start ${
        align === "right" ? "right-text" : ""
      }`}
    >
      <span className={`desc-text full-width ${className || ""}`}>{title}</span>
      <span className="highlight full-width">{text}</span>
    </div>
  );
};

interface RowProps {
  title: string;
  text: string | ReactChild;
  desc?: boolean;
  className?: string;
}

export const RowCell: React.FC<RowProps> = ({
  title,
  text,
  desc,
  className,
}) => {
  return (
    <div className={`flex items-center content-sbw ${className || ""}`}>
      <span className="desc-text">{title} </span>
      <span className={`${desc ? "desc-text" : "highlight"}`}>{text}</span>
    </div>
  );
};

export default TableMobile;
