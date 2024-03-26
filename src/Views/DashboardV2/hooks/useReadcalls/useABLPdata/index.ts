import { IBLP } from '@Views/Dashboard/interface';
import { useABLPreadcallData } from './useABLPreadcallData';
import { add, divide, multiply } from '@Utils/NumString/stringArithmatics';
import {
  BASIS_POINTS_DIVISOR,
  SECONDS_PER_YEAR,
  fromWei,
} from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { usePoolByAsset } from '@Views/ABTradePage/Hooks/usePoolByAsset';

export const useABLPdata = () => {
  const readcalldata = useABLPreadcallData();
  const pools = usePoolByAsset();
  const arbPool = pools['ARB'];
  const arb_decimals = arbPool?.decimals || 6;
  const arbPrice = '1';

  //   console.log('readcalldata', readcalldata);
  let responseObj: Omit<IBLP, 'usdc_pol' | 'usdc_total' | 'market_cap'> | null =
    null;

  if (readcalldata !== null) {
    const {
      ARBvaultPOL,
      ablpInitialRate,
      ablpSupply,
      ablpTotalBalance,
      amountARBpool,
      feeArbBlpTrackerTokensPerInterval,
      stakedArbBlpTrackerTokensPerInterval,
    } = readcalldata;

    if (
      ablpInitialRate === undefined ||
      ablpSupply === undefined ||
      ablpTotalBalance === undefined ||
      amountARBpool === undefined ||
      feeArbBlpTrackerTokensPerInterval === undefined ||
      stakedArbBlpTrackerTokensPerInterval === undefined ||
      ARBvaultPOL === undefined
    )
      return null;

    const ablpPrice =
      ablpSupply > 0
        ? (divide(ablpTotalBalance, ablpSupply) as string)
        : (divide('1', ablpInitialRate) as string);

    const feeArbBlpTrackerAnnualRewardsUsd = fromWei(
      multiply(feeArbBlpTrackerTokensPerInterval, SECONDS_PER_YEAR),
      arb_decimals
    );
    const arbblpAprForRewardToken =
      ablpSupply > 0
        ? (divide(
            multiply(feeArbBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(ablpSupply, ablpPrice), arb_decimals)
          ) as string)
        : '0';
    const stakedArbBlpTrackerAnnualRewardsUsd = fromWei(
      multiply(
        multiply(stakedArbBlpTrackerTokensPerInterval, SECONDS_PER_YEAR),
        arbPrice
      )
    );
    const arbblpAprForEsBfr =
      ablpSupply > 0
        ? (divide(
            multiply(stakedArbBlpTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
            fromWei(multiply(ablpSupply, ablpPrice), arb_decimals)
          ) as string)
        : '0';
    const ablpAprTotal = add(arbblpAprForRewardToken, arbblpAprForEsBfr);

    responseObj = {
      price: ablpPrice,
      supply: fromWei(ablpSupply, arb_decimals),
      total_usdc: fromWei(amountARBpool, arb_decimals),
      apr: {
        value: fromWei(ablpAprTotal, 2),
        tooltip: [
          // { key: 'Escrowed BFR APR', value: fromWei(arbblpAprForEsBfr, 2) },
          { key: 'ARB APR', value: fromWei(arbblpAprForRewardToken, 2) },
        ],
        description:
          'APRs are updated weekly on Wednesday and will depend on the fees collected for the week.',
      },
    };
  }

  return responseObj;
};
