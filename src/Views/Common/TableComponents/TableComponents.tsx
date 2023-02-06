import { ReactChild, ReactNode } from "react";
import InfoIcon from "src/SVG/Elements/InfoIcon";
import VersionChip from "@Views/Common/VersionChip";
import { AssetCellLayout, CellDescLayout } from "./style";

interface ITableCellInfo {
  label: string | ReactChild;
  desc?: ReactNode;
  className?: string;
  headStyle?: string;
}

interface ILockeValue {
  labels: ITableCellInfo[];
}

const CellHeadDesc: React.FC<ILockeValue> = ({ labels }) => {
  if (!labels.length) return;
  return (
    <CellDescLayout>
      <div className="flexc-center mobile-align">
        <span
          className={`head-text text-left flex-center ${labels[0].headStyle}`}
        >
          {labels[0].label}
          {labels[0].desc && (
            <InfoIcon className="tml" sm tooltip={labels[0].desc} />
          )}
        </span>
        {labels.slice(1).map((cellInfo: ITableCellInfo) => (
          <span className={`desc-text text-left flex ${cellInfo?.className}`}>
            {cellInfo.label}
            {cellInfo.desc && (
              <InfoIcon sm className="tml txxmt" tooltip={cellInfo?.desc} />
            )}
          </span>
        ))}
      </div>
    </CellDescLayout>
  );
};

interface IAssetCell {
  version?: number | string;
  tooltip?: string;
  head: string;
  img?: string;
  desc?: any;
  style?: string;
  remark?: ReactNode;
  assetStyle?: string;
}

const AssetCell: React.FC<IAssetCell> = ({
  version,
  head,
  desc,
  tooltip,
  remark,
  img,
  assetStyle,
  style,
}) => {
  return (
    <AssetCellLayout>
      <div className={`${style ? style : "flex"}`}>
        <div className={`relative ${assetStyle}`}>
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
          {desc && <span className="desc-text text-left ">{desc}</span>}
          {remark && <span className="desc-text text-left">{remark}</span>}
        </div>
      </div>
    </AssetCellLayout>
  );
};

interface ITableHeads {
  children: string | JSX.Element;
  tooltip?: string;
  style?: string;
}

const TableHeads: React.FC<ITableHeads> = ({ children, style, tooltip }) => {
  return (
    <div className={`f14 capitialize ${style}`}>
      {children}
      {tooltip && (
        <img src="/PredictionGames/info.svg" alt="" className="info-tooltip" />
      )}
    </div>
  );
};

export { CellHeadDesc, AssetCell, TableHeads };
