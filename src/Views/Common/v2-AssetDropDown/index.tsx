import { ClickAwayListener, Skeleton } from "@mui/material";
import { useGlobal } from "@Contexts/Global";
import React, { useEffect, useState } from "react";
import { replaceAsset } from "@Utils/appControls/replaceAsset";
import { Background } from "./style";
import { closeDrawer } from "@Utils/appControls/mobileDrawerHandlers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import V2BufferInput from "../v2-BufferInput";
import useSWR from "swr";
import { divide } from "@Utils/NumString/stringArithmatics";
import { Display } from "../Tooltips/Display";
import { IBinaryMarket } from "@Contexts/Global/reducer";

export default function AssetDropDown({ isDropdown }) {
  const [search, setSearch] = useState("");
  const { state } = useGlobal();
  const [currentAsset, setCurrentAsset] = useState<IBinaryMarket>(null);
  const [open, setOpen] = useState(false);
  const shouldBeOpen = isDropdown ? open : true;
  const { data: res } = useSWR(marketKey);
  const handleClickAway = () => {
    setOpen(false);
    setCurrentAsset(state.settings.activeAsset);
  };
  const onChange = (val) => {
    setSearch(val);
  };
  const getList = () => {
    return search.length > 0
      ? res.data.filter((asset) =>
          asset.underlying_asset.name
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : res?.data;
  };
  const assetChangeHandler = (asset: string) => {
    // TODO see this, nex/router removed
    // replaceAsset(router, asset);
  };

  useEffect(() => {
    if (!state.settings.activeAsset) return;
    setCurrentAsset(state.settings.activeAsset);
  }, [state.settings.activeAsset]);
  let len = state.assets?.length ? getList()?.length : 0;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Background>
        <>
          <div
            className="unset"
            onClick={() => {
              if (len === 0 || len == 1) return;
              setOpen(true);
              setCurrentAsset(null);
            }}
          >
            {currentAsset && isDropdown ? (
              <div className="assetList y-auto">
                <AssetBtn
                  activeAsset={currentAsset.underlying_asset.name}
                  singleAsset={currentAsset}
                  assetChangeHandler={() => {}}
                  isDropdown={len === 0 || len == 1 ? false : isDropdown}
                  key={currentAsset.underlying_asset.address}
                />
              </div>
            ) : (
              <V2BufferInput
                placeholder="Search"
                className="input"
                value={search}
                onChange={onChange}
              />
            )}
          </div>

          {shouldBeOpen && (
            <div className={`assetList`}>
              {state.assets?.length ? (
                getList()?.length ? (
                  getList().map((singleAsset, index) => (
                    <AssetBtn
                      key={singleAsset.token}
                      singleAsset={singleAsset}
                      activeAsset={
                        state.settings.activeAsset?.underlying_asset.name
                      }
                      assetChangeHandler={() => {
                        assetChangeHandler(
                          singleAsset.underlying_asset.name.toUpperCase()
                        );
                        setCurrentAsset(singleAsset);
                        setOpen(false);
                        closeDrawer();
                      }}
                    />
                  ))
                ) : (
                  <div className="info--text">
                    No data matched your search&nbsp;
                    <span className="primary">{search}</span>
                  </div>
                )
              ) : (
                <Skeleton variant="rectangular" className="lc wf h20" />
              )}
            </div>
          )}
        </>
      </Background>
    </ClickAwayListener>
  );
}

interface IAssetBtn {
  singleAsset: IBinaryMarket;
  activeAsset: string | undefined;
  assetChangeHandler: () => void;
  isDropdown?: boolean;
}

const AssetBtn: React.FC<IAssetBtn> = ({
  singleAsset,
  activeAsset,
  assetChangeHandler,
  isDropdown,
}) => {
  // const priceWei = useCryptoPrice(singleAsset.token);
  // const price = priceWei && toFixed(divide(priceWei, 8), 2);

  return (
    <div
      className={`flex items-center content-sbw ${
        isDropdown ? "pr" : ""
      } assets pointer 
      ${
        singleAsset?.underlying_asset.name?.toUpperCase() ==
          activeAsset?.toUpperCase() && "active"
      }
       `}
      role="button"
      onClick={assetChangeHandler}
    >
      <div className="flex items-center ">
        <img
          className="assetImage"
          src={singleAsset.underlying_asset.img}
          alt=""
        />
        <span className="font3 weight-400 assetName">
          {singleAsset.underlying_asset.name}
        </span>
      </div>
      <div className="flex-center">
        <span className="font3 weight-400 assetPrice">
          {singleAsset?.underlying_asset.current_price ? (
            <Display
              data={divide(
                singleAsset.underlying_asset.current_price.toString(),
                8
              )}
              label="$"
            />
          ) : (
            <Skeleton className="lc w6 h3 r" />
          )}
        </span>
        {isDropdown && (
          <ExpandMoreIcon className={`arrow xtml text-1 small-icon`} />
        )}
      </div>
    </div>
  );
};
