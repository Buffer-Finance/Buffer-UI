import { Skeleton } from "@mui/material";
import { useGlobal } from "@Contexts/Global";
import { divide, roundUp } from "@Utils/NumString/stringArithmatics";
import { Display } from "@Views/Common/Tooltips/Display";
import { NewBinaryStyles } from "../style";

export const BinaryInfo = () => {
  const { state } = useGlobal();
  const asset = state.settings.activeAsset;
  function InfoComponent({ keyName, value }) {
    return (
      <div className="flexc-center info-com ">
        <div className="f14 text-6 fw4">{keyName}</div>
        <div className="f18 text-1 fw5">{value}</div>
      </div>
    );
  }
  if (!asset || !asset.underlying_asset || !asset.available_liquidity)
    return <Skeleton className="lc fw h15" />;
  const displayData = [
    {
      key: "24h Change",
      value: <Stats info={asset.underlying_asset["24_hour_change"]} />,
    },
    {
      key: "Current Price",
      value: (
        <Display
          data={divide(asset.underlying_asset.current_price.toString(), 8)}
          label="$"
        />
      ),
    },

    {
      key: "Available Liquidity",
      value: (
        <div className="flex-center">
          <Display
            data={roundUp(asset.available_liquidity.toString())}
            label="$"
          />
          <div className="ml5">{state.settings.activeAsset.deposit_token}</div>
        </div>
      ),
    },

    {
      key: "IV",
      value: asset.iv,
    },
    {
      key: "Pool Utilization",
      value: asset.pool_utilization,
    },
  ];

  return (
    <NewBinaryStyles>
      <div className="info-com flex">
        <img
          className="assetImage"
          src={asset.underlying_asset.img}
          alt="token"
        />
        <div className="flex-col assetName">
          <span className="f18">{asset.underlying_asset?.name}</span>
          <span className="fw4 f14 light-blue-text">
            {asset.underlying_asset?.full_name}
          </span>
        </div>
      </div>

      {displayData.map((data) => (
        <InfoComponent key={data.key} keyName={data.key} value={data.value} />
      ))}
    </NewBinaryStyles>
  );
};

export const Stats: React.FC<any> = ({
  info,
  fontSize,
  arrowStyles,
  shouldNotShowImg = false,
}) => {
  if (info?.error) return <Skeleton className="lc w-full h-3" />;
  const isString = typeof info === "string";
  const isNegative = isString ? info.charAt(0) === "-" : info < 0;
  if (info == "N/A") return null;
  return (
    <>
      {info == null || info == undefined ? (
        "Loading..."
      ) : (
        <>
          {!shouldNotShowImg && (
            <img
              src={`${isNegative ? "/Triangle_Down.svg" : "/Triangle_Up.svg"}`}
              alt="arrow"
              className={`mr3 ${arrowStyles}`}
            />
          )}
          <Display
            data={isString ? info.split("%")[0] : info}
            className={` inline fw4  ${
              isNegative ? "red" : "green"
            } ${fontSize}`}
            unit={"%"}
          />
        </>
      )}
    </>
  );
};
