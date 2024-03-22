import BlpAbi from '@Views/Earn/Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import bfrAbi from '@Views/Earn/Config/Abis/BFR.json';
import { appConfig } from '@Views/TradePage/config';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';
import { getCallId } from '@Utils/Contract/multiContract';

export const getUBLPreadcalls = (chainID: number | undefined) => {
  if (chainID === undefined) return [];
  const { EarnConfig, DashboardConfig } =
    appConfig[chainID as unknown as keyof typeof appConfig];
  const pools = usePoolByAsset();
  const usdcPool = pools['USDC'];

  const calls = [
    // blpTotalBalance:
    {
      address: EarnConfig.BLP,
      abi: BlpAbi,
      name: 'totalTokenXBalance',
      id: getCallId('totalTokenXBalance', EarnConfig.BLP, chainID),
    },
    //   blpSupply:
    {
      address: EarnConfig.BLP,
      abi: bfrAbi,
      name: 'totalSupply',
      id: getCallId('totalSupply', EarnConfig.BLP, chainID),
    },
    //   blpInitialRate:
    {
      address: EarnConfig.BLP,
      abi: BlpAbi,
      name: 'INITIAL_RATE',
      id: getCallId('INITIAL_RATE', EarnConfig.BLP, chainID),
    },
    //   totalStakedBLP:
    {
      address: EarnConfig.BLP,
      abi: bfrAbi,
      name: 'balanceOf',
      params: [EarnConfig.FeeBlpTracker],
      id: getCallId(
        'balanceOf',
        EarnConfig.BLP,
        chainID,
        EarnConfig.FeeBlpTracker
      ),
    },
    //   totalSupplyBLP:
    {
      address: EarnConfig.BLP,
      abi: bfrAbi,
      name: 'totalSupply',
      id: getCallId('totalSupply', EarnConfig.BLP, chainID),
    },

    //   feeBlpTrackerTokensPerInterval:
    {
      address: EarnConfig.FeeBlpTracker,
      abi: RewardTrackerAbi,
      name: 'tokensPerInterval',
      id: getCallId('tokensPerInterval', EarnConfig.FeeBlpTracker, chainID),
    },
    //   stakedBlpTrackerTokensPerInterval:
    {
      address: EarnConfig.StakedBlpTracker,
      abi: RewardTrackerAbi,
      name: 'tokensPerInterval',
      id: getCallId('tokensPerInterval', EarnConfig.StakedBlpTracker, chainID),
    },

    //   USDCvaultPOL:
    {
      address: EarnConfig.StakedBlpTracker,
      abi: RewardTrackerAbi,
      name: 'depositBalances',
      params: [DashboardConfig.usdcLiquidityAddress, EarnConfig.FeeBlpTracker],
      id: getCallId(
        'depositBalances',
        EarnConfig.StakedBlpTracker,
        chainID,
        DashboardConfig.usdcLiquidityAddress,
        EarnConfig.FeeBlpTracker
      ),
    },
  ];

  if (usdcPool) {
    calls.push({
      //   amountUSDCpool:
      address: usdcPool.tokenAddress,
      abi: bfrAbi,
      name: 'balanceOf',
      params: [usdcPool.poolAddress],
      id: getCallId(
        'balanceOf',
        usdcPool.tokenAddress,
        chainID,
        usdcPool.poolAddress
      ),
    });
  }
  return calls;
};
