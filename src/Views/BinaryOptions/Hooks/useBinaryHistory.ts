import { useUserAccount } from "@Hooks/useUserAccount";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { sessionAtom } from "src/atoms/generic";
import { postRes } from "@Utils/apis/api";
import { getBrowserName } from "@Utils/appControls/getBrowserName";
import { getConnectionSpeed } from "@Utils/speedtest";
import { useAccount } from "wagmi";
import { IQTrade } from "..";
import { IHistory } from "../store";
import { useTradeHistory } from "./useTradeHistory";

const useBinaryHistory = (
  configData: IQTrade,
  tradesCount: number,
  currentPage: number,
  isHistoryTable?: boolean,
  shouldFetchOldData?: boolean
) => {
  const data = useTradeHistory(configData, shouldFetchOldData);
  const { address: account } = useUserAccount();
  const [session_token] = useAtom(sessionAtom);
  let filteredData;
  const registerVisibility = async () => {
    let speed: any = await getConnectionSpeed();
    speed = speed + "";
    const [res, err] = await postRes("/binary/performance/option/visibility/", {
      account,
      updated_at: Math.round(new Date().getTime() / 1000),
      session_token,
      browser: getBrowserName(),
      internet_speed: speed,
    });
  };

  useEffect(() => {
    if (!data || !data.length) return;
    for (let i of data) {
      if (i.is_new) {
        registerVisibility();
        break;
      }
    }
  }, [data]);

  // filter OTC and QuickTrade bets
  // if (tempData && tempData.length) {
  //   for (let bet of tempData) {
  //     const creationEpoch = Math.round(
  //       new Date(bet.creation_date).getTime() / 1e3
  //     );
  //     const difference = bet.expiration - creationEpoch;
  //     if (!activeVerticalTab) {
  //       if (difference <= SECONDS_IN_ONE_DAY) {
  //         data.push(bet);
  //       }
  //     } else {
  //       if (difference > SECONDS_IN_ONE_DAY) {
  //         data.push(bet);
  //       }
  //     }
  //   }
  // }

  if (data) {
    if (isHistoryTable) {
      filteredData = data.filter(
        (bet) =>
          bet.state == "exercised" ||
          bet.state == "cancelled" ||
          bet.state == "pending" ||
          bet.state == "expired"
      );
    } else {
      filteredData = data.filter(
        (bet) => bet.state == "active" || bet.state == "queued"
      );
    }
  }
  if (isHistoryTable) {
    filteredData?.sort(function (a: IHistory, b: IHistory) {
      return b.expiration - a.expiration;
    });
  } else {
    filteredData?.sort(function (a: IHistory, b: IHistory) {
      return b.creation_date - a.creation_date;
    });
  }
  if (tradesCount && currentPage) {
    const startIndex = tradesCount * currentPage - tradesCount;
    const endIndex = startIndex + tradesCount;

    return {
      data: filteredData.slice(startIndex, endIndex),
      totalLength: filteredData.length,
    };
  }
  return {
    data: filteredData as IHistory[],
    totalLength: filteredData.length,
  };
};

export default useBinaryHistory;
