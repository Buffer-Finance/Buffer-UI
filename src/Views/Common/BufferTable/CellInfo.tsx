import { ReactChild, ReactNode } from "react";
import InfoIcon from "src/SVG/Elements/InfoIcon";
import VersionChip from "@Views/Common/VersionChip";
import { AssetCellLayout, CellDescLayout } from "@Views/Common/TableComponents/style";

interface ITableCellInfo {
  label: string | ReactChild;
  desc?: ReactNode;
  className?: string;
  headStyle?: string;
}

interface ILockeValue {
  labels: ReactNode[] | ITableCellInfo[];
  whiteIdx?: number;
  className?: string;
  style?: string;
}
interface ICellContent {
  content: ReactNode[];
  className?: string;
  classNames?: string[];
  preventDefault?: boolean;
}

const CellInfo: React.FC<ILockeValue> = ({
  labels,
  whiteIdx,
  className,
  style,
}) => {
  if (!labels.length) return;
  return (
    <CellDescLayout className={className}>
      <div className="flex-col mobile-align">
        {/* <span className={`desc-txt text-left flex-center`}>{labels[0]}</span> */}
        {labels.map((cellInfo, key) => {
          return (
            <span
              className={` text-left flex ${
                key === whiteIdx && "lbold"
              } ${style}`}
              key={key}
            >
              {cellInfo}
            </span>
          );
        })}
      </div>
    </CellDescLayout>
  );
};

const CellContent: React.FC<ICellContent> = ({
  content,
  classNames,
  preventDefault,
  className,
}) => {
  if (!content.length) return;
  return (
    <div className={`${className} flex flex-col`}>
      {content.map((cellInfo, key) => {
        return (
          <span
            className={`${classNames?.length >= key ? classNames[key] : null} ${
              key && !preventDefault && " text-4 "
            }`}
            key={key}
          >
            {cellInfo}
          </span>
        );
      })}
    </div>
  );
};
interface IAssetCell {
  version?: number | string;
  tooltip?: string;
  head: string;
  img?: string;
  desc?: string;
  style?: string;
  remark?: ReactNode;
}

const AssetCell: React.FC<IAssetCell> = ({
  version,
  head,
  desc,
  tooltip,
  remark,
  img,
  style,
}) => {
  return (
    <AssetCellLayout>
      <div className={`${style ? style : "flex"}`}>
        <div className="relative">
          {img && <img className="table-asset-icon" src={img}></img>}
          {version && (
            <div className="version-chip">
              <VersionChip version={20} />
            </div>
          )}
        </div>
        <div className="flex-col sxml">
          <span className="head-text text-left flex content-start items-center">
            {head}
            {tooltip && (
              <InfoIcon
                sm
                className="tml"
                tooltip="The APR comes from revenue distribution generated through options trading"
              />
            )}
          </span>
          {desc && <span className="desc-text text-left">{desc}</span>}
          {remark && <span className="desc-text text-left">{remark}</span>}
        </div>
      </div>
    </AssetCellLayout>
  );
};

interface ITableHeads {
  children: string;
  tooltip?: string;
  style?: string;
}

const TableHeads: React.FC<ITableHeads> = ({ children, style, tooltip }) => {
  return (
    <div className={`flex-center font3 xxsf lbold ${style}`}>
      {children}
      {tooltip && (
        <img src="/PredictionGames/info.svg" alt="" className="info-tooltip" />
      )}
    </div>
  );
};

export { CellInfo, AssetCell, TableHeads, CellContent };
