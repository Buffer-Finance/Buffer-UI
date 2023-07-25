import {
  fromWei,
  useIbfrPrice,
} from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useBFRReadCallData } from './useBFRReadCallData';
import { IBFR } from '@Views/Dashboard/interface';
import { subtract } from '@Utils/NumString/stringArithmatics';
import { useMainnetData } from './useMainnetData';
import { roundToTwo } from '@Utils/roundOff';

export const useBFRdata = () => {
  const readCallResponse = useBFRReadCallData();
  const bfrPrice = useIbfrPrice();
  const { mainnetData } = useMainnetData();
  // console.log('mainnetData', mainnetData, bfrPrice, readCallResponse);

  let responseObj: IBFR | null = null;

  if (
    readCallResponse !== undefined &&
    bfrPrice !== undefined &&
    mainnetData !== undefined
  ) {
    const { totalStakedBFR, totalSupplyBFR, bfrPoolBalance, burnBFRAmount } =
      readCallResponse;

    const netSupply = roundToTwo(
      fromWei(subtract(totalSupplyBFR, burnBFRAmount)),
      2
    ) as string;
    const circulatingSupply =
      mainnetData && netSupply && bfrPoolBalance
        ? subtract(
            subtract(netSupply, mainnetData.amountInPools),
            fromWei(bfrPoolBalance)
          )
        : undefined;

    responseObj = {
      price: bfrPrice,
      supply: netSupply,
      total_staked: fromWei(totalStakedBFR),
      circulatingSupply: circulatingSupply,
      liquidity_pools_token: mainnetData?.lpTokens,
    };
  }

  return responseObj;
};
