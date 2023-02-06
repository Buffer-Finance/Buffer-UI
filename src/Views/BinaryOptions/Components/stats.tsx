import { Skeleton } from "@mui/material";
import useSWR from "swr";

const Stats = () => {
  const StatsKey: any = {};
  const { data: statsData, error: statsError } = useSWR(StatsKey);

  let stats = [];

  if (statsData)
    stats = [
      {
        head: "24h Change",
        desc: statsData["24_hour_change"],
      },
      {
        head: "Current Price",
        desc: "$" + statsData.current_price,
      },
      // {
      //   head: "Total Volume",
      //   desc: "$" + statsData.total_volume,
      // },
      {
        head: "Available Liquidity",
        desc: "$" + statsData.available_liquidity,
      },
    ];
  return (
    <div className="flex">
      {stats.map((s, idx) => (
        <div className="flexc-center movement" key={idx}>
          <h2 className={`head`}>{s.head}</h2>
          {statsData ? (
            <h2 className={`desc ${idx === 0 ? "green" : ""}`}>
              {idx === 0 && (
                <span className="sxmr">
                  <img src="/Triangle Up.svg" alt="" />
                </span>
              )}
              {s.desc}
            </h2>
          ) : (
            <Skeleton variant="rectangular" className="w2 h2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stats;
