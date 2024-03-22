import { appConfig } from '@Views/TradePage/config';
import bfrAbi from '@Views/Earn/Config/Abis/BFR.json';
import { getCallId } from '@Utils/Contract/multiContract';

export const getArbitrumBFRreadcalls = (
  activeChainId: number | undefined,
  bfrPoolAddress: string
) => {
  if (!activeChainId) return [];
  const { EarnConfig } =
    appConfig[activeChainId as unknown as keyof typeof appConfig];
  return [
    // totalStakedBFR
    {
      address: EarnConfig.iBFR,
      abi: bfrAbi,
      name: 'balanceOf',
      id: getCallId(
        EarnConfig.iBFR,
        'balanceOf',
        activeChainId,
        EarnConfig.StakedBfrTracker
      ),
      params: [EarnConfig.StakedBfrTracker],
    },
    // totalSupplyBFR
    {
      address: EarnConfig.iBFR,
      abi: bfrAbi,
      name: 'totalSupply',
      id: getCallId(EarnConfig.iBFR, 'totalSupply', activeChainId),
    },
    // burnBFRAmount:
    {
      address: EarnConfig.iBFR,
      abi: bfrAbi,
      name: 'balanceOf',
      params: [EarnConfig.burnAddress],
      id: getCallId(
        EarnConfig.iBFR,
        'balanceOf',
        activeChainId,
        EarnConfig.burnAddress
      ),
    },
    // bfrPoolBalance:
    {
      address: EarnConfig.iBFR,
      abi: bfrAbi,
      name: 'balanceOf',
      params: [bfrPoolAddress],
      id: getCallId(
        EarnConfig.iBFR,
        'balanceOf',
        activeChainId,
        bfrPoolAddress
      ),
    },
  ];
};
