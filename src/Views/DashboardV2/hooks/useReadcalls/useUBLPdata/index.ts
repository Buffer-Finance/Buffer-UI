import { IBLP } from '@Views/Dashboard/interface';
import { useUBLPreadcallData } from './useUBLPreadcallData';
import { add, divide, multiply } from '@Utils/NumString/stringArithmatics';
import {
  BASIS_POINTS_DIVISOR,
  SECONDS_PER_YEAR,
  fromWei,
  useIbfrPrice,
} from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';

export const useUBLPdata = () => {
  const readcalldata = useUBLPreadcallData();
  const pools = usePoolByAsset();
  const usdcPool = pools['USDC.E'];
  const usd_decimals = usdcPool?.decimals || 6;
  const bfrPrice = useIbfrPrice();

  let responseObj: IBLP | null = null;

  if (readcalldata !== null) {
    const {
      USDCvaultPOL,
      amountUSDCpool,
      blpInitialRate,
      blpSupply,
      blpTotalBalance,
      feeBlpTrackerTokensPerInterval,
      stakedBlpTrackerTokensPerInterval,
      totalStakedBLP,
      totalSupplyBLP,
    } = readcalldata;
    if (
      blpTotalBalance === undefined ||
      blpSupply === undefined ||
      blpInitialRate === undefined ||
      totalStakedBLP === undefined ||
      totalSupplyBLP === undefined ||
      feeBlpTrackerTokensPerInterval === undefined ||
      stakedBlpTrackerTokensPerInterval === undefined
    )
      return null;

    const blpPrice =
      blpSupply > 0
        ? (divide(blpTotalBalance, blpSupply) as string)
        : (divide('1', blpInitialRate) as string);

    const totalUSDCstaked = multiply(
      fromWei(totalStakedBLP, usd_decimals),
      blpPrice
    );

    const feeBlpTrackerAnnualRewardsUsd = fromWei(
      multiply(feeBlpTrackerTokensPerInterval, SECONDS_PER_YEAR),
      usd_decimals
    );
    const stakedBlpTrackerAnnualRewardsUsd = fromWei(
      multiply(
        multiply(stakedBlpTrackerTokensPerInterval, SECONDS_PER_YEAR),
        bfrPrice
      )
    );

    const blpAprForRewardToken =
      blpSupply > 0
        ? (divide(
            multiply(feeBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(blpSupply, blpPrice), usd_decimals)
          ) as string)
        : '0';

    const blpAprForEsBfr =
      blpSupply > 0
        ? (divide(
            multiply(stakedBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(blpSupply, blpPrice), usd_decimals)
          ) as string)
        : '0';
    const blpAprTotal = add(blpAprForRewardToken, blpAprForEsBfr);

    responseObj = {
      price: blpPrice,
      supply: divide(fromWei(amountUSDCpool, usd_decimals), blpPrice) as string,
      // total_staked: totalUSDCstaked,
      market_cap: multiply(blpPrice, fromWei(totalSupplyBLP, usd_decimals)),

      apr: {
        value: fromWei(blpAprTotal, 2),
        tooltip: [
          { key: 'Escrowed BFR APR', value: fromWei(blpAprForEsBfr, 2) },
          { key: 'USDC APR', value: fromWei(blpAprForRewardToken, 2) },
        ],
        description:
          'APRs are updated weekly on Wednesday and will depend on the fees collected for the week.',
      },
      total_usdc: fromWei(amountUSDCpool, usd_decimals),
      usdc_pol: USDCvaultPOL ? fromWei(USDCvaultPOL, usd_decimals) : null,
      usdc_total: fromWei(amountUSDCpool, usd_decimals),
    };
  }

  return responseObj;
};
