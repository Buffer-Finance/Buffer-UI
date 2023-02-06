import useSWR from "swr";
import { useQTinfo } from "..";
import axios from "axios";
import { useMemo } from "react";

interface IMarketChange {
  priceChangePercent: string;
  symbol: string;
}

export const useLatest24hrChange = (singleAsset) => {
  const qtInfo = useQTinfo();
  const allMarkets = useMemo(
    () =>
      qtInfo.pairs.map((singleMarket) => {
        return `"${singleMarket.tv_id}"`;
      }),
    []
  );
  const latest24hrChange = useSWR<IMarketChange[]>("24hr-price-change", {
    fetcher: async (calls) => {
      const response = await axios.get(
        "https://www.binance.com/api/v3/ticker/24hr?symbols=[" +
          allMarkets.join(",") +
          "]"
      );
      return response.data;
    },
    refreshInterval: 30000,
  });

  function getAssetPrice() {
    return latest24hrChange.data?.find(
      (asset) => asset.symbol === singleAsset.tv_id
    );
  }

  const assetPrice = useMemo(() => {
    return getAssetPrice();
  }, [latest24hrChange, singleAsset]);


  return assetPrice;
};
