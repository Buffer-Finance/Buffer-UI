import Style from "./styles";
import Button from "@Views/Common/Buttons";
import { usePageState } from "@Contexts/Pages/PredictionGames";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { usePageState as optionsState } from "@Contexts/Pages/Options";
import useAssetPrice from "@Hooks/Contracts/useAssetPrice";
import { divide } from "@Utils/NumString/stringArithmatics";
import { toFixed } from "@Utils/NumString";
import { Skeleton } from "@mui/material";
import { useGlobal } from "@Contexts/Global";
import { openDrawer } from "@Utils/appControls/mobileDrawerHandlers";
import { getApi } from "@Utils/apis/api";
import { useEffect, useState } from "react";
import { drawerType } from "@Views/BinaryOptions/store";
import { useAtom } from "jotai";
import { Display } from "../Tooltips/Display";

interface IAssetInfo {
  change_in_price: number;
  current_price: number;
  asset: string;
}
const AssetInfo: React.FC<any> = ({ isOption }) => {
  const { state } = useGlobal();
  const [pageState, pageDispatch] = isOption ? optionsState() : usePageState();
  const [info, setInfo] = useState<IAssetInfo>();
  const price = useAssetPrice();
  const [isAssetDrawer, setIsAssetDrawer] = useAtom(drawerType);

  const getAssetInfo = async () => {
    if (!state.settings.activeAsset || !state.settings.activeAsset.name) return;
    const [res, err] = await getApi("/price/volatility/", {
      environment: state.settings.activeChain?.env,
      asset: state.settings.activeAsset.name,
    });
    if (err) return;
    setInfo(res);
  };

  useEffect(() => {
    if (!state.settings.activeChain) return;
    if (!state.settings.activeAsset) return;
    getAssetInfo();
  }, [state.settings.activeAsset, state.settings.activeChain]);
  return (
    <Style className="flex full-width">
      <div className="asset fix-wi flex-center">
        <div className="flex items-start">
          {state.settings.activeAsset ? (
            <img
              className="assetImage"
              src={
                state.settings.activeAsset.img ||
                state.settings.activeAsset.underlying_asset.img
              }
              alt=""
            />
          ) : (
            <Skeleton variant="circular" className="assetImage lc" />
          )}
          <div className="flex-col assetName">
            {state.settings.activeAsset ? (
              <span className="font3  assetCode">
                {state.settings.activeAsset.name ||
                  state.settings.activeAsset.underlying_asset.name}
              </span>
            ) : (
              <Skeleton variant="rectangular" className="w4 h3 lc" />
            )}
            {(state.settings.activeAsset && info) ||
            state.settings.activeAsset?.underlying_asset ? (
              <>
                <span className="tb">
                  <span className="font3 weight-400 f16 light-blue-text">
                    {info?.asset}
                  </span>
                </span>
                {state.settings.activeAsset?.underlying_asset ? (
                  <Display
                    data={divide(
                      state.settings.activeAsset?.underlying_asset?.current_price.toString(),
                      8
                    )}
                    label="$"
                    className="s f15 fw4 mt2"
                  />
                ) : (
                  <Stats className="s" price={price} info={info} />
                )}
              </>
            ) : (
              <Skeleton className="w5 h2 lc" />
            )}
          </div>
        </div>
      </div>
      <div className="movement flex-col items-center content-center tb">
        <div className="up font3 weight-400">24h Change</div>
        <Stats price={price} info={info} />
      </div>
      <div className="movement flex-col items-center content-center tb">
        <div className="up font3 weight-400">Current Price</div>
        <div className=" font3 weight-400 text-1 f18">
          {price[1] ? (
            "$" + toFixed(divide(price[1], 8), 3)
          ) : (
            <Skeleton className="lc w7 h3" />
          )}
        </div>
      </div>
      <div className="assetPrice movement flex items-center content-center content-sbw tb">
        {/* <div className="wrapper">
          <div className="up font3 weight-500">24h Low</div>
          <div className="down text-1 font3 weight-600">1842.59 USD</div>
        </div> */}
        <Button
          onClick={() => pageDispatch({ type: "SET_CHART", payload: true })}
          className="chartButton font3 weight-400"
        >
          {/* <ChartIcon className="txmr" /> */}
          Chart
        </Button>
      </div>
      <div
        className="switch-asset-btn s"
        onClick={() => {
          setIsAssetDrawer(true);
          openDrawer();
        }}
      >
        Switch Asset
        <ExpandMoreIcon className={`asset-picker-icon`} />
      </div>
    </Style>
  );
};
export default AssetInfo;

interface IStats {
  className?: string;
  price?: string[];
  info: IAssetInfo;
}

const Stats: React.FC<IStats> = ({ className, price, info }) => {
  return (
    <>
      {info ? (
        <div className={`down tb ${className}`}>
          {info.change_in_price < 0 ? (
            <img src="/Triangle_Down.svg" alt="" />
          ) : (
            <img src="/Triangle_Up.svg" alt="" />
          )}{" "}
          <span
            className={`font3 weight-400 f18 ${
              info.change_in_price < 0 ? "red" : "change"
            }`}
          >
            {Math.abs(info.change_in_price)}
          </span>
        </div>
      ) : (
        <Skeleton className="lc w7 h3" />
      )}
      <div className={`down s ${className}`}>
        <span className="font3 weight-400 mobile-price change nowrap">
          {price[1] ? (
            "$" + toFixed(divide(price[1], 8), 3)
          ) : (
            <Skeleton className="lc w7 h3" />
          )}
        </span>
      </div>
    </>
  );
};
