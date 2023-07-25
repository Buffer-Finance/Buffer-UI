import { otherBlpType } from '@Views/DashboardV2/types';
import { useReadCallData } from './useReadCallData';
import { divide } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';

export const useOtherChainBLPdata = () => {
  const data = useReadCallData();
  const allDecimals = useDecimalsByAsset();
  const usdcDecimals = allDecimals['USDC'];
  let response: otherBlpType | null = null;
  if (data) {
    const { amountUSDCpool, blpInitialRate, blpSupply, blpTotalBalance } = data;

    const blpPrice =
      blpSupply > 0
        ? (divide(blpTotalBalance, blpSupply) as string)
        : (divide('1', blpInitialRate) as string);

    response = {
      price: blpPrice,
      supply: fromWei(blpSupply, usdcDecimals),
      total_usdc: fromWei(amountUSDCpool, usdcDecimals),
      usdc_pol: fromWei(amountUSDCpool, usdcDecimals),
      usdc_total: fromWei(amountUSDCpool, usdcDecimals),
    };
  }
  return response;
};
