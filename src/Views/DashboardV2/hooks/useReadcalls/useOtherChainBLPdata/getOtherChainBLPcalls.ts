import { getCallId } from '@Utils/Contract/multiContract';
import bfrAbi from '@Views/Earn/Config/Abis/BFR.json';
import BlpAbi from '@Views/Earn/Config/Abis/BufferBinaryIBFRPoolBinaryV2.json';
import { poolInfoType } from '@Views/ABTradePage/type';

export const getOtherChainBLPcalls = (
  usdcPool: poolInfoType & {
    poolAddress: string;
  }
) => {
  if (!usdcPool) return [];
  return [
    // blpTotalBalance:
    {
      address: usdcPool.poolAddress,
      abi: BlpAbi,
      name: 'totalTokenXBalance',
      id: getCallId(usdcPool.poolAddress, 'totalTokenXBalance'),
    },
    //   blpSupply:
    {
      address: usdcPool.poolAddress,
      abi: bfrAbi,
      name: 'totalSupply',
      id: getCallId(usdcPool.poolAddress, 'totalSupply'),
    },
    //   blpInitialRate:
    {
      address: usdcPool.poolAddress,
      abi: BlpAbi,
      name: 'INITIAL_RATE',
      id: getCallId(usdcPool.poolAddress, 'INITIAL_RATE'),
    },
    //   amountUSDCpool:
    {
      address: usdcPool.tokenAddress,
      abi: bfrAbi,
      name: 'balanceOf',
      params: [usdcPool.poolAddress],
      id: getCallId(usdcPool.tokenAddress, 'balanceOf', usdcPool.poolAddress),
    },
  ];
};
