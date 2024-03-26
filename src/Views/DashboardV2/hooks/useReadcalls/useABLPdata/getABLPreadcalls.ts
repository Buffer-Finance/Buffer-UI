import BlpAbi from '@Views/Earn/Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import bfrAbi from '@Views/Earn/Config/Abis/BFR.json';
import { appConfig } from '@Views/ABTradePage/config';
import { usePoolByAsset } from '@Views/ABTradePage/Hooks/usePoolByAsset';
import { getCallId } from '@Utils/Contract/multiContract';

export const getABLPreadcalls = (chainID: number | undefined) => {
  if (chainID === undefined) return [];
  const { EarnConfig, DashboardConfig } =
    appConfig[chainID as unknown as keyof typeof appConfig];
  const pools = usePoolByAsset();
  const arbPool = pools['ARB'];

  const calls = [
    // ablpTotalBalance:
    {
      address: arbPool.poolAddress,
      abi: BlpAbi,
      name: 'totalTokenXBalance',
      id: getCallId('totalTokenXBalance', arbPool.poolAddress, chainID),
    },
    //   ablpSupply:
    {
      address: arbPool.poolAddress,
      abi: bfrAbi,
      name: 'totalSupply',
      id: getCallId('totalSupply', arbPool.poolAddress, chainID),
    },

    //   ablpInitialRate:
    {
      address: arbPool.poolAddress,
      abi: BlpAbi,
      name: 'INITIAL_RATE',
      id: getCallId('INITIAL_RATE', arbPool.poolAddress, chainID),
    },
    //   amountARBpool:
    {
      address: arbPool.tokenAddress,
      abi: bfrAbi,
      name: 'balanceOf',
      params: [arbPool.poolAddress],
      id: getCallId(
        'balanceOf',
        arbPool.tokenAddress,
        chainID,
        arbPool.poolAddress
      ),
    },
    //   stakedArbBlpTrackerTokensPerInterval:
    {
      address: EarnConfig.StakedBlpTracker2,
      abi: RewardTrackerAbi,
      name: 'tokensPerInterval',
      id: getCallId('tokensPerInterval', EarnConfig.StakedBlpTracker2, chainID),
    },
    //   feeArbBlpTrackerTokensPerInterval:
    {
      address: EarnConfig.FeeBlpTracker2,
      abi: RewardTrackerAbi,
      name: 'tokensPerInterval',
      id: getCallId('tokensPerInterval', EarnConfig.FeeBlpTracker2, chainID),
    },
    //   ARBvaultPOL:
    {
      address: EarnConfig.StakedBlpTracker2,
      abi: RewardTrackerAbi,
      name: 'depositBalances',
      params: [DashboardConfig.usdcLiquidityAddress, EarnConfig.FeeBlpTracker2],
      id: getCallId(
        'depositBalances',
        EarnConfig.StakedBlpTracker2,
        chainID,
        DashboardConfig.usdcLiquidityAddress,
        EarnConfig.FeeBlpTracker2
      ),
    },
  ];

  //   if (arbPool) {

  //   }
  return calls;
};
