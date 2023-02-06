import axios from "axios";
import { useUserAccount } from "@Hooks/useUserAccount";
import { atom } from "jotai";
import { useEffect, useState } from "react";
import getDeepCopy from "@Utils/getDeepCopy";
import { divide, subtract } from "@Utils/NumString/stringArithmatics";
import { convertBNtoString } from "@Utils/useReadCall";
import { useContractReads } from "wagmi";
import { IMarket, IQTrade } from "..";
import OptionMetaABI from "../ABI/OptionMeta.json";
import { IHistory } from "../store";

const stateMapping = {
  0: "inactive",
  1: "active",
  2: "exercised",
  3: "expired",
  4: "cancelled",
};
const poolDecimals = 6;
const depositTokenName = "USDC";
export const expiryPriceCache = {};
export const pendingTradeExpiryPricesAtom = atom({});
export const useTradeHistory = (
  configData: IQTrade,
  shouldFetchOldData?: boolean
) => {
  // const qtInfo = useQTinfo();
  const { address } = useUserAccount();
  let normalOptionsReq = configData.pairs.map((singleMarket) => {
    const targetContract = shouldFetchOldData
      ? singleMarket.pools[0].options_contracts.past[0]
      : singleMarket.pools[0].options_contracts.current;
    return {
      address: configData.optionMeta,
      abi: OptionMetaABI,
      functionName: "getOptionsForUser",
      args: [address, targetContract, 500, 0],
    };
  });
  let queuedOptionsReq = {
    address: configData.optionMeta,
    abi: OptionMetaABI,
    functionName: "getQueuedOptionsForUser",
    args: [address, configData.routerContract, 500, 0],
  };
  let cancelledOptionsReq = {
    address: configData.optionMeta,
    abi: OptionMetaABI,
    functionName: "getCancelledOptionsForUser",
    args: [address, configData.routerContract, 500, 0],
  };
  let allRequests = [
    queuedOptionsReq,
    cancelledOptionsReq,
    ...normalOptionsReq,
  ];

  let { data } = useContractReads({
    contracts: address ? allRequests : [],
    watch: true,
  });
  const [filteredBets, setFilteredBets] = useState<IHistory[]>([]);
  useEffect(() => {
    let allMarketBets = getDeepCopy(data);
    convertBNtoString(allMarketBets);
    let bets = [];
    allMarketBets?.forEach((market, marketIndex) => {
      market?.forEach((tempBet) => {
        // remove queued option if it is cancelled by user
        if (marketIndex == 0) {
          if (!tempBet[12]) return;
        }

        let bet = getBetMetadata(
          configData,
          marketIndex,
          address,
          tempBet,
          shouldFetchOldData
        );
        if (!bet) return;
        if (bet.state == "pending") {
          axios
            .get(
              `https://www.binance.com/api/v3/uiKlines?symbol=${
                bet.tv_id
              }&interval=1s&startTime=${bet.expiration * 1e3}&endTime=${
                bet.expiration * 1e3
              }`
            )
            .then((price) => {
              if (!expiryPriceCache[bet.option_id] && price.data?.[0]?.[4])
                expiryPriceCache[bet.option_id] = price.data[0][4];
            });
        }
        bets.push(bet);
      });
    });
    setFilteredBets(bets);
  }, [data]);

  return filteredBets;
};

function getBetMetadata(
  qtInfo: IQTrade,
  marketIndex,
  address,
  tempBet,
  shouldFetchOldData
): IHistory {
  let activeMarket: IMarket;
  let isNormalOption;
  if (tempBet?.targetContract) {
    activeMarket = qtInfo.pairs.find((market) => {
      if (shouldFetchOldData) {
        return (
          market.pools[0].options_contracts.current == tempBet.targetContract
        );
      }

      return (
        market.pools[0].options_contracts.current == tempBet.targetContract
      );
    });
    isNormalOption = false;
  } else {
    activeMarket = qtInfo.pairs[marketIndex - 2];
    isNormalOption = true;
  }
  if ((shouldFetchOldData && !isNormalOption) || !activeMarket) {
    return null;
  }
  let bet = {
    is_new: true,
    iv: 12000,
    environment: "arbitrum-test",
    contract_address: activeMarket.pools[0].options_contracts.current,
    asset: activeMarket,
    user: address,
    tv_id: activeMarket.tv_id,
    is_payout_credited: true,
  } as IHistory;
  const contractResMappings = getContractResMapping(
    tempBet,
    isNormalOption,
    marketIndex
  );
  for (let mapping of contractResMappings) {
    if (mapping?.key && mapping?.value) bet[mapping.key] = mapping.value();
  }
  return bet;
}

function getContractResMapping(tempBet, isNormalOption, marketIndex) {
  const betPayout = tempBet[1] == 3 ? "0" : divide(tempBet[4], poolDecimals);
  const currentEpoch = Date.now() / 1e3;
  if (isNormalOption)
    return [
      { key: "option_id", value: () => tempBet[0] },
      { key: "is_queued", value: () => false },
      { key: "creation_date", value: () => +tempBet[11] },
      { key: "strike", value: () => divide(tempBet[2], 8) },
      { key: "total_fee", value: () => divide(tempBet[10], poolDecimals) },
      { key: "premium", value: () => divide(tempBet[5], poolDecimals) },
      { key: "locked_amount", value: () => divide(tempBet[4], poolDecimals) },
      { key: "expiration", value: () => +tempBet[6] },
      { key: "normal_option", value: () => true },
      {
        key: "state",
        value: () => {
          if (+tempBet[6] < currentEpoch && tempBet[1] == 1) {
            return "pending";
          }
          return stateMapping[tempBet[1]];
        },
      },
      { key: "size", value: () => divide(tempBet[3], poolDecimals) },
      { key: "option_type", value: () => tempBet[7] },
      { key: "is_yes", value: () => tempBet[8] },
      { key: "is_above", value: () => tempBet[9] },
      { key: "price_at_expiry", value: () => divide(tempBet[12], 8) },
      { key: "deposit_token", value: () => depositTokenName },
      { key: "txn_token", value: () => depositTokenName },
      { key: "payout", value: () => betPayout },
      {
        key: "net_pnl",
        value: () => subtract(betPayout, divide(tempBet[10], poolDecimals)),
      },
      { key: "roi", value: () => betPayout },
    ];
  else
    return [
      { key: "creation_date", value: () => +tempBet[10] },
      { key: "strike", value: () => divide(tempBet[7], 8) },
      { key: "total_fee", value: () => divide(tempBet[3], poolDecimals) },
      { key: "slippage", value: () => divide(tempBet[8], 2) },
      { key: "premium", value: () => divide(tempBet[5], poolDecimals) },
      { key: "locked_amount", value: () => divide(tempBet[4], poolDecimals) },
      { key: "normal_option", value: () => false },
      {
        key: "expiration",
        value: () => +tempBet[11],
      },
      {
        key: "state",
        value: () => (marketIndex == 0 ? "queued" : "cancelled"),
      },
      marketIndex == 0 && {
        key: "queue_id",
        value: () => tempBet[0],
      },
      { key: "size", value: () => divide(tempBet[3], poolDecimals) },
      { key: "option_type", value: () => tempBet[7] },
      { key: "is_yes", value: () => tempBet[8] },
      { key: "is_above", value: () => tempBet[5] },
      { key: "price_at_expiry", value: () => divide(tempBet[12], 8) },
      { key: "deposit_token", value: () => depositTokenName },
      { key: "txn_token", value: () => depositTokenName },
      { key: "payout", value: () => betPayout },
      {
        key: "net_pnl",
        value: () => subtract(betPayout, divide(tempBet[10], poolDecimals)),
      },
      { key: "roi", value: () => betPayout },
    ];
}
