import { ReactChild, ReactNode } from "react";
import VersionChip from "../../VersionChip";
import Layout from "./style";

interface IAssetCell {
  version?: number | string;
  tooltip?: string;
  head: string;
  imgs?: string[];
  desc?: string;
  headStyle?: string;
  style?: string;
  fullWidth?: boolean;
  remark?: ReactNode;
}

const AssetCellMobile: React.FC<IAssetCell> = ({
  version,
  head,
  desc,
  tooltip,
  imgs,
  headStyle,
  style,
  remark,
  fullWidth,
}) => {
  return (
    <Layout>
      <div className={`${fullWidth && "full-width"}`}>
        <div className={`${style ? style : "flex"}`}>
          <div className="relative">
            <div className="imgs-row">
              {imgs && (
                <img className="lower-img table-asset-icon" src={imgs[0]}></img>
              )}
              {imgs[1] && (
                <img className="upper-img table-asset-icon" src={imgs[1]}></img>
              )}
            </div>

            {version && (
              <div className="version-chip">
                <VersionChip version={20} />
              </div>
            )}
          </div>
          <div className="flex-col lift-up">
            <span
              className={`headText text-left txxxmb ${
                headStyle ? headStyle : "flex-center"
              }`}
            >
              {head}
              {tooltip && (
                <img
                  src="/PredictionGames/info.svg"
                  alt=""
                  className="info-tooltip"
                />
              )}
            </span>
            {desc && <span className="descText text-left">{desc}</span>}
            {remark && <span className="descText text-left">{remark}</span>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssetCellMobile;
