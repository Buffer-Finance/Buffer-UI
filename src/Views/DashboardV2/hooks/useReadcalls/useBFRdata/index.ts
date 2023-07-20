import {
  TOTALSUPPLY,
  fromWei,
  useIbfrPrice,
} from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useBFRReadCallData } from './useBFRReadCallData';
import { IBFR } from '@Views/Dashboard/interface';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { useMainnetData } from './useMainnetData';

export const useBFRdata = () => {
  const readCallResponse = useBFRReadCallData();
  const bfrPrice = useIbfrPrice();
  const { mainnetData } = useMainnetData();
  console.log('mainnetData', mainnetData, bfrPrice, readCallResponse);

  let responseObj: IBFR | null = null;

  if (
    readCallResponse !== undefined &&
    bfrPrice !== undefined &&
    mainnetData !== undefined
  ) {
    const { totalStakedBFR, totalSupplyBFR } = readCallResponse;
    responseObj = {
      price: bfrPrice,
      supply: fromWei(TOTALSUPPLY.toString()),
      total_staked: fromWei(totalStakedBFR),
      market_cap: multiply(bfrPrice, fromWei(totalSupplyBFR)),
      circulatingSupply: mainnetData?.circulatingSupply
        ? '' + mainnetData.circulatingSupply
        : null,
      liquidity_pools_token: mainnetData?.lpTokens,
    };
  }

  return responseObj;
};
